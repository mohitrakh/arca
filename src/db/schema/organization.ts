import { boolean, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { createId } from '@paralleldrive/cuid2';
import { userTable } from './users';

export const organizationTable = mysqlTable('organizations', {
    id: varchar({ length: 128 }).primaryKey().$defaultFn(() => createId()),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 2000 }),
    is_active: boolean().notNull().$default(() => true), // soft delete
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    created_by: varchar({ length: 128 }).notNull().references(() => userTable.id, { onDelete: 'cascade' }),
});

