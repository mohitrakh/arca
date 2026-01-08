import { eq } from "drizzle-orm";
import { db } from "../../db";
import { projectMembershipTable } from "../../db/schema/projectMembership";
import { projectTable } from "../../db/schema/projects";
import { AppError } from "../../utils/app-error";
import { CreateProjectInput } from "./project.schema";

export class ProjectService {
    static async createProject(payload: CreateProjectInput, orgId: string, userId: string, role: string) {

        if (role !== 'ORG_ADMIN') {
            throw new AppError('Unauthorized', 401)
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
}