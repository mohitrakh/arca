import { db } from "../../db";
import { taskTable } from "../../db/schema/tasks";
import { buildTaskFilters, getTaskOrderBy } from "./utils";
import { ListTasksInput } from "./tasks.schema";

export const listTasks = async ({
    projectId,
    orgId,
    query,
}: {
    projectId: string;
    orgId: string;
    query: ListTasksInput;
}) => {
    const {
        page,
        limit,
        sortBy,
        sortOrder,
        ...filters
    } = query;

    const offset = (page - 1) * limit;

    return db
        .select()
        .from(taskTable)
        .where(
            buildTaskFilters({
                projectId,
                orgId,
                filters,
            })
        )
        .limit(limit)
        .offset(offset)
        .orderBy(getTaskOrderBy(sortBy, sortOrder));
};
