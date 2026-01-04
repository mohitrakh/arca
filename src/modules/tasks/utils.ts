import { and, asc, desc, eq, like, SQL } from "drizzle-orm";
import { taskTable } from "../../db/schema/tasks";
import { TaskPriority, TaskStatus } from "../../constants/task";

export const buildTaskFilters = ({
    projectId,
    orgId,
    filters,
}: {
    projectId: string;
    orgId: string;
    filters: {
        status?: TaskStatus;
        priority?: TaskPriority;
        assigned_to?: string;
        search?: string;
    };
}) => {
    const conditions: SQL[] = [
        eq(taskTable.project_id, projectId),
        eq(taskTable.organization_id, orgId),
    ];

    if (filters.status) {
        conditions.push(eq(taskTable.status, filters.status));
    }

    if (filters.priority) {
        conditions.push(eq(taskTable.priority, filters.priority));
    }

    if (filters.assigned_to) {
        conditions.push(eq(taskTable.assigned_to, filters.assigned_to));
    }

    if (filters.search) {
        conditions.push(like(taskTable.title, `%${filters.search}%`));
    }

    return and(...conditions);
};

export const getTaskOrderBy = (
    sortBy: "created_at" | "due_date" | "priority",
    sortOrder: "asc" | "desc"
) => {
    const columnMap = {
        created_at: taskTable.created_at,
        due_date: taskTable.due_date,
        priority: taskTable.priority,
    };

    const column = columnMap[sortBy];

    return sortOrder === "desc" ? desc(column) : asc(column);
};
