import { boolean, date, datetime, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { createId } from '@paralleldrive/cuid2';

export const userTable = mysqlTable('users', {
    id: varchar({ length: 128 }).primaryKey().$defaultFn(() => createId()),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    password_hash: varchar({ length: 255 }).notNull(),
    is_active: boolean().notNull().$default(() => true),
    created_at: datetime().notNull().$default(() => new Date()),
    updated_at: datetime().notNull().$default(() => new Date())
});
