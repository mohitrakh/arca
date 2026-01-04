import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 1. Set default values if the error isn't an AppError
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let success = false;

    // 2. Log the error for the developer (the 'captureStackTrace' makes this log clean!)
    console.error("LOG ❌ ----------");
    console.error(`Status: ${statusCode}`);
    console.error(`Message: ${message}`);
    console.error(err.stack); // This shows you exactly where the bug is
    console.error("----------------");

    // 3. Send the response to the client
    res.status(statusCode).json({
        success,
        message,
        // We only show the stack trace in development mode for security
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};