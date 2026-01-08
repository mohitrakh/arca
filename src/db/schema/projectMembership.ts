import { boolean, mysqlEnum, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { createId } from '@paralleldrive/cuid2';
import { projectTable } from './projects';
import { userTable } from './users';
import { PROJECT_ROLE_VALUES } from '../../constants/roles';

export const projectMembershipTable = mysqlTable('project_memberships', {
    id: varchar({ length: 128 }).primaryKey().$defaultFn(() => createId()),
    project_id: varchar({ length: 128 }).notNull().references(() => projectTable.id, { onDelete: 'cascade' }),
    user_id: varchar({ length: 128 }).notNull().references(() => userTable.id, { onDelete: 'cascade' }),
    role: mysqlEnum('role', PROJECT_ROLE_VALUES).notNull(),
    is_active: boolean().notNull().$default(() => true),
    joined_at: timestamp('joined_at').notNull().defaultNow()
});