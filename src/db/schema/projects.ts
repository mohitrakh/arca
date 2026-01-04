import { date, datetime, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { createId } from '@paralleldrive/cuid2';
import { organizationTable } from './organization';
import { clientTable } from './clients';

export const projectTable = mysqlTable('projects', {
    id: varchar({ length: 128 }).primaryKey().$defaultFn(() => createId()),
    organization_id: varchar({ length: 128 }).notNull().references(() => organizationTable.id, { onDelete: 'cascade' }),
    client_id: varchar({ length: 128 }).notNull().references(() => clientTable.id, { onDelete: 'cascade' }),
    name: varchar({ length: 256 }).notNull(),
    description: varchar({ length: 1024 }),
    start_date: date(),
    due_date: date(),
    tech_stack: varchar({ length: 512 }),
    created_at: datetime().notNull().$default(() => new Date()),
    updated_at: datetime().notNull().$default(() => new Date())
});