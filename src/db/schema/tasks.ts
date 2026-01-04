import { boolean, date, datetime, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { createId } from '@paralleldrive/cuid2';
import { organizationTable } from './organization';
import { userTable } from './users';
import { projectTable } from './projects';
import { TASK_PRIORITY_LIST, TASK_STATUS_LIST } from '../../constants/task';

export const taskTable = mysqlTable('tasks', {
    id: varchar({ length: 128 }).primaryKey().$defaultFn(() => createId()),
    organization_id: varchar({ length: 128 }).notNull().references(() => organizationTable.id, { onDelete: 'cascade' }),
    project_id: varchar({ length: 128 }).notNull().references(() => projectTable.id, { onDelete: 'cascade' }),
    title: varchar({ length: 256 }).notNull(),
    description: varchar({ length: 1024 }),
    assigned_to: varchar({ length: 128 }).references(() => userTable.id, { onDelete: 'set null' }),
    status: mysqlEnum('status', TASK_STATUS_LIST).notNull().$default(() => 'CREATED'),
    priority: mysqlEnum('priority', TASK_PRIORITY_LIST).notNull().$default(() => 'MEDIUM'),
    due_date: date(),
    created_at: datetime().notNull().$default(() => new Date()),
    updated_at: datetime().notNull().$default(() => new Date()),
    created_by: varchar({ length: 128 })
        .notNull()
        .references(() => userTable.id, { onDelete: 'restrict' })
});
