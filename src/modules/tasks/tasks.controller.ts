import { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import { taskTable } from "../../db/schema/tasks";
import { ApiResponse } from "../../utils/api-response";
import { and, asc, desc, eq, like, SQL } from "drizzle-orm";
import { AppError } from "../../utils/app-error";
import { ListTasksInput } from "./tasks.schema";
import { listTasks } from "./tasks.service";


const createTask = async (req: Request, res: Response, next: NextFunction) => {
    const task = await db.insert(taskTable).values({
        title: req.body.title,
        description: req.body.description,
        assigned_to: req.body.assigned_to,
        priority: req.body.priority,
        due_date: req.body.due_date,

        project_id: req.project!.id,
        organization_id: req.org!.id,
        created_by: req.auth!.userId,
        status: 'CREATED'
    }).$returningId();

    console.log('TaskCreated', task[0].id)

    return ApiResponse.success(res, task, "Task created Successfully", 201)
}


const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    const tasks = await listTasks({
        projectId: req.project!.id,
        orgId: req.org!.id,
        query: req.query as unknown as ListTasksInput,
    });

    return ApiResponse.success(res, tasks, "Tasks retrieved successfully");
};


export {
    createTask,
    getTasks
}