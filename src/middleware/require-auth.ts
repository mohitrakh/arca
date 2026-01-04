import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import env from "../config/env";
import { db } from "../db";
import { userTable } from "../db/schema/users";
import { and, eq } from "drizzle-orm";
import { AppError } from "../utils/app-error"; // Your custom class

export interface JwtPayloadWithUserId extends JwtPayload {
    userId: string;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        // 1. Check if header exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new AppError('Authentication required. Please provide a valid token.', 401));
        }

        const token = authHeader.split(' ')[1];

        // 2. Check if token exists in header
        if (!token) {
            return next(new AppError('Invalid token format.', 401));
        }

        // 3. Verify JWT
        const decoded = jwt.verify(token, env.jwtSecret) as JwtPayloadWithUserId;

        // 4. Fetch User with Drizzle
        const [user] = await db
            .select()
            .from(userTable)
            .where(
                and(
                    eq(userTable.id, decoded.userId),
                    eq(userTable.is_active, true)
                )
            )
            .limit(1);

        // 5. Check if user exists/active
        if (!user) {
            return next(new AppError('User not found or account is deactivated.', 401));
        }

        // 6. Success: Attach to request and move to next middleware/controller
        req.auth = {
            userId: user.id
        }
        next();

    } catch (error) {
        // Handle JWT specific errors using our class
        if (error instanceof jwt.TokenExpiredError) {
            return next(new AppError('Token has expired. Please login again.', 401));
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError('Invalid token.', 401));
        }

        // Fallback for unexpected errors (Database down, etc)
        next(error);
    }
}