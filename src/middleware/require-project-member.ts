import { Request, Response, NextFunction } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { projectTable } from "../db/schema/projects";
import { projectMembershipTable } from "../db/schema/projectMembership";
import { AppError } from "../utils/app-error";

export const requireProjectMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.userId;
        const orgId = req.org?.id;
        const { projectId } = req.params;

        // 1. Validation: Ensure we have the necessary context from previous middlewares
        if (!userId || !orgId) {
            return next(new AppError("Authentication and Organization context required", 400));
        }

        if (!projectId) {
            return next(new AppError("Project ID is required", 400));
        }

        // 2. Multi-tenant Verification + Membership Check
        // We join the project with its membership to verify everything in one query
        const [result] = await db
            .select({
                projectId: projectTable.id,
                role: projectMembershipTable.role,
                isActive: projectMembershipTable.is_active
            })
            .from(projectTable)
            .innerJoin(
                projectMembershipTable,
                eq(projectTable.id, projectMembershipTable.project_id)
            )
            .where(
                and(
                    eq(projectTable.id, projectId),
                    eq(projectTable.organization_id, orgId), // CRITICAL: Tenant Isolation
                    eq(projectMembershipTable.user_id, userId)
                )
            )
            .limit(1);

        // 3. Handling "Not Found" vs "Not Authorized"
        // If result is empty, it means the project doesn't exist in THIS org, 
        // OR the user isn't a member. We return 404 for security to avoid "Project ID fishing".
        if (!result) {
            return next(new AppError("Project not found", 404));
        }

        // 4. Check if membership is active
        if (!result.isActive) {
            return next(new AppError("Your membership to this project is inactive", 403));
        }

        // 5. Success: Attach project context for the controller
        req.project = {
            id: result.projectId,
            role: result.role
        };

        next();
    } catch (error) {
        next(error);
    }
};