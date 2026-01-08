import { boolean, date, datetime, int, mysqlEnum, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { createId } from '@paralleldrive/cuid2';
import { organizationTable } from './organization';
import { userTable } from './users';
import { ORG_ROLE_VALUES } from '../../constants/roles';

export const orgMembershipTable = mysqlTable('organization_memberships', {
    id: varchar({ length: 128 }).primaryKey().$defaultFn(() => createId()),
    organization_id: varchar({ length: 128 }).notNull().references(() => organizationTable.id, { onDelete: 'cascade' }),
    user_id: varchar({ length: 128 }).notNull().references(() => userTable.id, { onDelete: 'cascade' }),
    role: mysqlEnum('role', ORG_ROLE_VALUES).notNull(),
    is_active: boolean().notNull().$default(() => true),
    joined_at: timestamp('joined_at').notNull().defaultNow()
});