import { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import { taskTable } from "../../db/schema/tasks";
import { ApiResponse } from "../../utils/api-response";
import { ListTasksInput } from "./tasks.schema";
import TaskService from "./tasks.service";


const createTask = async (req: Request, res: Response, next: NextFunction) => {
    const task = await TaskService.createtask(req.body, req.project!.id, req.org!.id, req.auth!.userId)
    return ApiResponse.success(res, task, "Task created Successfully", 201)
}


const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params;
    const orgId = req.org?.id!
    const query = req.query as unknown as ListTasksInput;

    const result = await TaskService.listTasks({ projectId, orgId, query });
    // Send paginated response
    return ApiResponse.list(
        res,
        result.data,
        result.data.length,
        result.pagination,
        "Tasks fetched successfully"
    );
};


const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    const { taskId } = req.params;
    const orgId = req.org?.id!

    const result = await TaskService.updateTask(taskId, orgId, req.body);
    // Send paginated response
    return ApiResponse.success(res, result, "Task updated successfully", 200);

};

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    const { taskId } = req.params;
    const orgId = req.org?.id!

    const result = await TaskService.deleteTask(taskId, orgId)

    return ApiResponse.success(res, result, "Task deleted successfully", 200);
};


export {
    createTask,
    getTasks,
    updateTask,
    deleteTask
}