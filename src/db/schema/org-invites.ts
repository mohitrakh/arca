import { mysqlTable, varchar, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { createId } from '@paralleldrive/cuid2';
import { organizationTable } from './organization';
import { userTable } from './users';
import { ORG_ROLE_VALUES, ORG_ROLES } from '../../constants/roles';
import { ORG_INVITE_STATUS, ORG_INVITE_VALUES } from '../../constants/invites';

export const organizationInvitesTable = mysqlTable('organization_invites', {
    id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
    email: varchar('email', { length: 255 }).notNull(),
    organization_id: varchar('organization_id', { length: 128 }).notNull().references(() => organizationTable.id, { onDelete: 'cascade' }),
    inviter_id: varchar('inviter_id', { length: 128 }).notNull().references(() => userTable.id, { onDelete: 'cascade' }),
    role: mysqlEnum('role', ORG_ROLE_VALUES).notNull().default(ORG_ROLES.MEMBER),
    status: mysqlEnum('status', ORG_INVITE_VALUES).notNull().default(ORG_INVITE_STATUS.PENDING),
    token: varchar('token', { length: 255 }).notNull().unique(),
    expires_at: timestamp('expires_at').notNull(),
    created_at: timestamp('created_at').defaultNow(),
});