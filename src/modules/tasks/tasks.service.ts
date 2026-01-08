import { db } from "../../db";
import { taskTable } from "../../db/schema/tasks";
import { buildTaskFilters, getTaskOrderBy } from "./utils";
import { CreateTaskInput, ListTasksInput } from "./tasks.schema";
import { count } from "drizzle-orm";

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
            sortBy,
            sortOrder,
            ...filters
        } = query;

        const offset = (page - 1) * limit;

        const filterCondition = buildTaskFilters({
            projectId,
            orgId,
            filters,
        });

        // 1️⃣ Get total count first
        const total = await db
            .select({ count: count() })
            .from(taskTable)
            .where(filterCondition)
            .then(res => res[0]?.count || 0);

        // 2️⃣ Fetch paginated rows
        const data = await db
            .select()
            .from(taskTable)
            .where(filterCondition)
            .limit(limit)
            .offset(offset)
            .orderBy(getTaskOrderBy(sortBy, sortOrder));

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

}
