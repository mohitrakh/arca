import { db } from "../../db";
import { taskTable } from "../../db/schema/tasks";
import { buildTaskFilters, getTaskOrderBy } from "./utils";
import { CreateTaskInput, ListTasksInput, UpdateTaskInput } from "./tasks.schema";
import { and, count, eq } from "drizzle-orm";
import { AppError } from "../../utils/app-error";
import { TaskStatus } from "../../constants/task";

export default class TaskService {
    static async createtask(payload: CreateTaskInput, projectId: string, organizationId: string, userId: string) {
        return await db.insert(taskTable).values({
            title: payload.title,
            description: payload.description,
            assigned_to: payload.assigned_to,
            priority: payload.priority,
            due_date: payload.due_date ? new Date(payload.due_date) : null,

            project_id: projectId,
            organization_id: organizationId,
            created_by: userId,
            status: 'CREATED'
        }).$returningId();
    }

    static async listTasks(
        {
            projectId,
            orgId,
            query,
        }:
            {
                projectId: string;
                orgId: string;
                query: ListTasksInput;
            }
    ) {
        const {
            page = 1,
            limit = 10,
        } = query;

        const offset = (page - 1) * limit;

        // const filterCondition = buildTaskFilters({
        //     projectId,
        //     orgId,
        //     filters,
        // });

        // 1️⃣ Get total count first
        const total = await db
            .select({ count: count() })
            .from(taskTable)
            .then(res => res[0]?.count || 0);

        // 2️⃣ Fetch paginated rows
        const data = await db
            .select()
            .from(taskTable)
            .where(
                eq(taskTable.organization_id, orgId)
            )
            .limit(limit)
            .offset(offset)

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    };

    static async updateTask(taskId: string, orgId: string, projectId: string, payload: UpdateTaskInput) {

        const task = await db.select().from(taskTable).where(
            and(
                eq(taskTable.id, taskId),
                eq(taskTable.organization_id, orgId),
                eq(taskTable.project_id, projectId)
            )
        );

        if (!task.length || !task[0]) {
            throw new AppError('Task not found', 404);
        }


        const { due_date, ...rest } = payload;

        const updateData = {
            ...rest,
            ...(due_date !== undefined && {
                due_date: due_date ? new Date(due_date) : null
            }),
            updated_at: new Date()
        };

        return await db.update(taskTable).set(updateData).where(
            and(
                eq(taskTable.id, taskId),
                eq(taskTable.organization_id, orgId),
                eq(taskTable.project_id, projectId)
            )
        );
    }

    static async deleteTask(taskId: string, orgId: string, projectId: string) {

        const task = await db.select().from(taskTable).where(
            and(
                eq(taskTable.id, taskId),
                eq(taskTable.organization_id, orgId),
                eq(taskTable.project_id, projectId)
            )
        );

        if (!task.length || !task[0]) {
            throw new AppError('Task not found', 404);
        }

        return await db.delete(taskTable).where(
            and(
                eq(taskTable.id, taskId),
                eq(taskTable.organization_id, orgId),
                eq(taskTable.project_id, projectId)
            )
        );
    }

    static async getTask(taskId: string, orgId: string, projectId: string) {
        const task = await db.select().from(taskTable).where(
            and(
                eq(taskTable.id, taskId),
                eq(taskTable.organization_id, orgId),
                eq(taskTable.project_id, projectId)
            )
        );

        if (!task.length || !task[0]) {
            throw new AppError('Task not found', 404);
        }

        return task[0];
    }

    static async updateTaskStatus(taskId: string, orgId: string, projectId: string, status: TaskStatus) {
        const task = await db.select().from(taskTable).where(
            and(
                eq(taskTable.id, taskId),
                eq(taskTable.organization_id, orgId),
                eq(taskTable.project_id, projectId)
            )
        );

        if (!task.length || !task[0]) {
            throw new AppError('Task not found', 404);
        }

        const updateData = {
            status,
            updated_at: new Date()
        };

        return await db.update(taskTable).set(updateData).where(
            and(
                eq(taskTable.id, taskId),
                eq(taskTable.organization_id, orgId),
                eq(taskTable.project_id, projectId)
            )
        );
    }
}
