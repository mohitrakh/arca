import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import { projectMembershipTable } from "../../db/schema/projectMembership";
import { projectTable } from "../../db/schema/projects";
import { AppError } from "../../utils/app-error";
import { CreateProjectInput, UpdateProjectInput } from "./project.schema";
import { ORG_ROLES, OrgRole, ProjectRole } from "../../constants/roles";
import { createId } from "@paralleldrive/cuid2";
import { userTable } from "../../db/schema/users";

export class ProjectService {
    static async createProject(payload: CreateProjectInput, orgId: string, userId: string, role: OrgRole) {

        if (role !== ORG_ROLES.ADMIN) {
            throw new AppError('You are not allowed to create Project', 400)
        }

        return await db.transaction(async (tx) => {
            const project = await tx.insert(projectTable).values({
                ...payload,
                organization_id: orgId,
            }).$returningId();

            await tx.insert(projectMembershipTable).values({
                project_id: project[0].id,
                user_id: userId,
                role: 'PROJECT_MANAGER',
            })
            return project
        })
    }

    static async getProjects(orgId: string) {
        return await db.select().from(projectTable).where(eq(projectTable.organization_id, orgId))
    }

    static async updateProjects(projectId: string, orgId: string, payload: UpdateProjectInput, orgRole: OrgRole) {
        const project = await db.select().from(projectTable).where(
            and(
                eq(projectTable.id, projectId),
                eq(projectTable.organization_id, orgId)
            )
        )

        if (!project.length || !project[0]) {
            throw new AppError('Project not found', 404)
        }

        if (orgRole !== ORG_ROLES.ADMIN) {
            throw new AppError('You are not allowed to update Project', 400)
        }

        return await db.update(projectTable).set(payload).where(
            and(
                eq(projectTable.id, projectId),
                eq(projectTable.organization_id, orgId)
            )
        )
    }

    static async deleteProjects(projectId: string, orgId: string, orgRole: OrgRole) {
        const project = await db.select().from(projectTable).where(
            and(
                eq(projectTable.id, projectId),
                eq(projectTable.organization_id, orgId)
            )
        )

        if (!project.length || !project[0]) {
            throw new AppError('Project not found', 404)
        }

        if (orgRole !== ORG_ROLES.ADMIN) {
            throw new AppError('You are not allowed to delete Project', 400)
        }

        return await db.delete(projectTable).where(
            and(
                eq(projectTable.id, projectId),
                eq(projectTable.organization_id, orgId)
            )
        )
    }
    static async addUsersToProject(projectId: string, orgId: string, orgRole: OrgRole, userIds: { userId: string, role: string }[]) {
        // 1. Validate Project & Org
        const [project] = await db.select().from(projectTable).where(
            and(
                eq(projectTable.id, projectId),
                eq(projectTable.organization_id, orgId)
            )
        );

        if (!project) {
            throw new AppError('Project not found in this organization', 404);
        }

        // 2. Permission Check
        if (orgRole !== ORG_ROLES.ADMIN) {
            throw new AppError('Only Organization Admins can bulk-add members', 403);
        }

        console.log(Array.isArray(userIds), userIds, "UserIds")

        // 3. Prepare data
        const membershipData = userIds.map((item) => ({
            id: createId(), // It's safer to generate IDs here for bulk inserts
            project_id: projectId,
            user_id: item.userId,
            role: item.role as ProjectRole,
        }));

        if (membershipData.length === 0) return [];

        // 4. Bulk Insert with "Ignore" (Crucial for MariaDB/MySQL)
        // .ignore() tells the DB: "If this user is already added, just skip them"
        return await db.insert(projectMembershipTable)
            .ignore()
            .values(membershipData);
    }

    static async removeUsersFromProject(projectId: string, orgId: string, orgRole: OrgRole, members: { userId: string }[]) {
        // 1. Validate Project & Org (Keep your check)
        const [project] = await db.select().from(projectTable).where(
            and(
                eq(projectTable.id, projectId),
                eq(projectTable.organization_id, orgId)
            )
        );

        if (!project) {
            throw new AppError('Project not found in this organization', 404);
        }

        // 2. Permission Check
        if (orgRole !== ORG_ROLES.ADMIN) {
            throw new AppError('Only Organization Admins can bulk-remove members', 403);
        }

        // 3. Extract just the IDs into a simple array: ['id1', 'id2']
        const idsToRemove = members.map(m => m.userId);

        if (idsToRemove.length === 0) return;

        // 4. Bulk Delete using inArray
        return await db.delete(projectMembershipTable).where(
            and(
                eq(projectMembershipTable.project_id, projectId),
                inArray(projectMembershipTable.user_id, idsToRemove)
            )
        );
    }

    static async fetchProjectMembers(projectId: string, orgId: string) {
        const project = await db.select().from(projectTable).where(
            and(
                eq(projectTable.id, projectId),
                eq(projectTable.organization_id, orgId)
            )
        )

        if (!project.length || !project[0]) {
            throw new AppError('Project not found in this organization', 404);
        }

        const data = await db.select({
            id: projectMembershipTable.id,
            name: userTable.name,
            email: userTable.email,
            role: projectMembershipTable.role
        }).from(projectMembershipTable).innerJoin(userTable, eq(projectMembershipTable.user_id, userTable.id)).where(
            and(
                eq(projectMembershipTable.project_id, projectId)
            )
        )

        return data
    }

}