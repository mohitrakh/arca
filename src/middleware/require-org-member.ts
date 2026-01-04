import { NextFunction, Request, Response } from "express";
import { and, eq } from "drizzle-orm"; // 1. Import helpers
import { AppError } from "../utils/app-error";
import { db } from "../db";
import { orgMembershipTable } from "../db/schema/orgMembership";

export const requireOrgMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // userId comes from requireAuth, org.id comes from resolveOrganization
        const userId = req.auth?.userId;
        const orgId = req.org?.id;

        if (!userId || !orgId) {
            return next(new AppError('Authentication and Organization context required', 400));
        }

        // 2. Query the membership table
        const [membership] = await db
            .select()
            .from(orgMembershipTable)
            .where(
                and(
                    eq(orgMembershipTable.user_id, userId),
                    eq(orgMembershipTable.organization_id, orgId),
                    eq(orgMembershipTable.is_active, true) // Ensure they aren't suspended
                )
            )
            .limit(1);

        // 3. If no membership found, they are trespassing
        if (!membership) {
            return next(new AppError('You do not have access to this organization', 403));
        }

        // 4. Update request object with the verified role
        req.org = {
            id: orgId,
            role: membership.role
        };

        next();
    } catch (error) {
        next(error);
    }
}