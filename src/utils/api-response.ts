import { Response } from "express";

export class ApiResponse {
    static success<T>(res: Response, data: T, message = "Success", status = 200) {
        return res.status(status).json({
            success: true,
            message,
            data,
        });
    }

    // Helpful for paginated results or large lists
    static list<T>(res: Response, data: T[], count: number, message = "Success") {
        return res.status(200).json({
            success: true,
            message,
            results: data.length,
            total: count,
            data,
        });
    }
}