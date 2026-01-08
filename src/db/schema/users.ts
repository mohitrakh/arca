import { boolean, timestamp, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { createId } from '@paralleldrive/cuid2';

export const userTable = mysqlTable('users', {
    id: varchar({ length: 128 }).primaryKey().$defaultFn(() => createId()),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    password_hash: varchar({ length: 255 }).notNull(),
    is_active: boolean().notNull().$default(() => true),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow()
});
