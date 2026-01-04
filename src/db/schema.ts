import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { createId } from '@paralleldrive/cuid2';

export const usersTable = mysqlTable('users_table', {
    id: int().primaryKey().autoincrement(), // FIXED
    name: varchar({ length: 255 }).notNull(),
    age: int().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});
