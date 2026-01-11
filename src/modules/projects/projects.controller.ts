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

const updateProject = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params;
    const orgId = req.org?.id!;
    const orgRole = req.org?.role!;

    const project = await ProjectService.updateProjects(projectId, orgId, req.body, orgRole);
    return ApiResponse.success(
        res,
        project,
        "Successfully updated project",
        200
    );
}

const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params;
    const orgId = req.org?.id!;
    const orgRole = req.org?.role!;
    const project = await ProjectService.deleteProjects(projectId, orgId, orgRole);
    return ApiResponse.success(
        res,
        project,
        "Successfully deleted project",
        200
    );
}


const addUsersToProject = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params;
    const members = req.body.members;
    const orgId = req.org?.id!;
    const orgRole = req.org?.role!;
    const project = await ProjectService.addUsersToProject(projectId, orgId, orgRole, members);
    return ApiResponse.success(
        res,
        project,
        "Successfully added users to project",
        200
    );
}

const removeUsersFromProject = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params;
    const members = req.body.members;
    const orgId = req.org?.id!;
    const orgRole = req.org?.role!;
    const project = await ProjectService.removeUsersFromProject(projectId, orgId, orgRole, members);
    return ApiResponse.success(
        res,
        project,
        "Successfully removed users from project",
        200
    );
}

const fetchUserOfProjects = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params;
    const orgId = req.org?.id!;
    const data = await ProjectService.fetchProjectMembers(projectId, orgId)
    return ApiResponse.success(
        res,
        data,
        "Successfully fetched users of project",
        200
    )
}

const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params;
    const orgId = req.org?.id!;
    const project = await ProjectService.getProjectById(projectId, orgId);
    return ApiResponse.success(
        res,
        project,
        "Successfully fetched project",
        200
    )
}


const updateProjectMemberRole = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId, userId } = req.params;
    const { role } = req.body;
    const orgId = req.org?.id!;
    const orgRole = req.org?.role!;

    const result = await ProjectService.updateUserRoleInProject(projectId, orgId, orgRole, userId, role);

    return ApiResponse.success(res, result, "Project member role updated successfully", 200);
}

export {
    createProject,
    getAllProjects,
    updateProject,
    deleteProject,
    addUsersToProject,
    removeUsersFromProject,
    fetchUserOfProjects,
    getProjectById,
    updateProjectMemberRole
}