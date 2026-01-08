import { NextFunction, Request, Response } from "express";
import { ProjectService } from "./project.service";
import { ApiResponse } from "../../utils/api-response";

const createProject = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.auth?.userId!;
    const orgId = req.org?.id!;
    const role = req.org?.role!;
    const project = await ProjectService.createProject(req.body, orgId, userId, role);
    return ApiResponse.success(
        res,
        project,
        "Successfully created project",
        201
    );
}

const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.org?.id!;
    const projects = await ProjectService.getProjects(orgId);
    return ApiResponse.success(
        res,
        projects,
        "Successfully fetched projects",
        200
    );
}

export {
    createProject,
    getAllProjects
}