import { db } from "../../db";
import { taskTable } from "../../db/schema/tasks";
import { buildTaskFilters, getTaskOrderBy } from "./utils";
import { CreateTaskInput, ListTasksInput, UpdateTaskInput } from "./tasks.schema";
import { and, count, eq, sql } from "drizzle-orm";
import { AppError } from "../../utils/app-error";
import { TaskStatus } from "../../constants/task";
import { DOMAIN_EVENTS, eventBus } from "../../utils/event-bus";

export default class TaskService {
    static async createtask(payload: CreateTaskInput, projectId: string, organizationId: string, userId: string) {
        console.log("Hello Task is being created Wallahi")
        const res = await db.insert(taskTable).values({
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
        eventBus.emit(DOMAIN_EVENTS.TASK.CREATED, { taskId: res[0].id, userId });

        return res
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

        // 1. Convert due_date and extract version
        const { due_date, version, ...rest } = payload;

        // 2. Prepare update data
        const updateData = {
            ...rest,
            ...(due_date !== undefined && {
                due_date: due_date ? new Date(due_date) : null
            }),
            // Always increment version on update
            version: sql`${taskTable.version} + 1`,
            updated_at: new Date()
        };

        // 3. Perform Update with Optimistic Locking Check
        // If 'version' is provided in payload, we assume the client wants to ensure
        // they are updating the specific version they saw.
        const [result] = await db.update(taskTable)
            .set(updateData)
            .where(
                and(
                    eq(taskTable.id, taskId),
                    eq(taskTable.organization_id, orgId),
                    eq(taskTable.project_id, projectId),
                    // If version is provided, we MUST match it.
                    version !== undefined ? eq(taskTable.version, version) : undefined
                )
            );

        // 4. Check if update was successful
        // If affectedRows is 0, it means either:
        // a) Task doesn't exist (or filtered out by org/project)
        // b) Version mismatch (Conflict)
        if (result.affectedRows === 0) {
            // We need to distinguish between "Not Found" and "Conflict".
            // Only do this check if we failed to update.
            const existing = await db.select({ id: taskTable.id, version: taskTable.version })
                .from(taskTable)
                .where(
                    and(
                        eq(taskTable.id, taskId),
                        eq(taskTable.organization_id, orgId),
                        eq(taskTable.project_id, projectId)
                    )
                )
                .then(res => res[0]);

            if (!existing) {
                throw new AppError('Task not found', 404);
            }

            // If task exists but we failed to update, and we passed a version, it's a conflict.
            if (version !== undefined && existing.version !== version) {
                throw new AppError('Conflict: Task has been modified by another user. Please refresh and try again.', 409);
            }

            // Fallback (shouldn't happen if logic is correct)
            throw new AppError('Could not update task', 500);
        }

        return { success: true };
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
