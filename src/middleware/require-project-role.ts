import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { ProjectRole } from "../constants/roles";

/**
 * Factory function to restrict access based on Project Roles
 * @param allowedRoles - Array of roles allowed to access the route
 */
export const requireProjectRole = (allowedRoles: ProjectRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        // 1. Check if the previous middleware (requireProjectMember) actually ran
        const userRole = req.project?.role;

        if (!userRole) {
            return next(new AppError("Project context missing. Ensure requireProjectMember is called first.", 500));
        }

        // 2. Check if the user's role is in the list of allowed roles
        const hasPermission = allowedRoles.includes(userRole);

        if (!hasPermission) {
            return next(new AppError("You do not have the required permissions for this action", 403));
        }

        // 3. Success!
        next();
    };
};