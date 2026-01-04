import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error";
import { db } from "../db";
import { organizationTable } from "../db/schema/organization";
import { eq } from "drizzle-orm";

export const resolveOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orgHeader = req.headers['x-org-id']

        if (!orgHeader) {
            return next(new AppError('The organization id is missing in header', 400))
        }

        // fetch organization here
        const orgId = Array.isArray(orgHeader) ? orgHeader[0] : orgHeader;

        const organizations = await db.select().from(organizationTable).where(eq(organizationTable.id, orgId))

        const org = organizations[0]

        if (!org) {
            return next(new AppError("Organization does not exist", 404))
        }

        req.org = {
            id: org.id
        }

        next()

    } catch (error) {
        next(error);
    }
}