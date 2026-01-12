import { createId } from "@paralleldrive/cuid2";
import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const auditLogsTable = mysqlTable("audit_logs", {
    id: varchar({ length: 128 }).primaryKey().$defaultFn(() => createId()),
    entity_id: varchar({ length: 128 }).notNull(),
    entity_type: varchar({ length: 128 }).notNull(),
    action: varchar({ length: 128 }).notNull(),
    change_diff: varchar({ length: 128 }).notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
})