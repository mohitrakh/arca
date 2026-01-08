import { date, json, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { createId } from '@paralleldrive/cuid2';
import { organizationTable } from './organization';
import { clientTable } from './clients';

export const projectTable = mysqlTable('projects', {
    id: varchar({ length: 128 }).primaryKey().$defaultFn(() => createId()),
    organization_id: varchar({ length: 128 }).notNull().references(() => organizationTable.id, { onDelete: 'cascade' }),
    client_id: varchar({ length: 128 }).references(() => clientTable.id, { onDelete: 'cascade' }),
    name: varchar({ length: 256 }).notNull(),
    description: varchar({ length: 1024 }),
    start_date: date(),
    due_date: date(),
    tech_stack: json('tech_stack').$type<string[]>(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow()
});