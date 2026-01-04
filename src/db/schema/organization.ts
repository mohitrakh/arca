import { boolean, date, datetime, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { createId } from '@paralleldrive/cuid2';

export const organizationTable = mysqlTable('organizations', {
    id: varchar({ length: 128 }).primaryKey().$defaultFn(() => createId()),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 2000 }),
    is_active: boolean().notNull().$default(() => true), // soft delete
    created_at: datetime().notNull().$default(() => new Date()),
    updated_at: datetime().notNull().$default(() => new Date())
});

