import { eventBus, DOMAIN_EVENTS } from '../../utils/event-bus';
import { db } from '../../db';
import { auditLogsTable } from '../../db/schema/audit-logs';

export function initTaskListeners() {
    eventBus.on(DOMAIN_EVENTS.TASK.CREATED, async (data) => {
        const { taskId, userId } = data;

        console.log(`[Audit Log]: Task ${taskId} created by ${userId}`);
        // Here you would call your EmailService or WebSocketService
    });

    eventBus.on(DOMAIN_EVENTS.TASK.STATUS_CHANGED, async (data) => {
        const { taskId, userId, oldStatus, newStatus } = data;

        await db.insert(auditLogsTable).values({
            entity_id: taskId,
            entity_type: 'TASK',
            action: 'STATUS_UPDATE',
            change_diff: `Status changed from ${oldStatus} to ${newStatus}`,
            // userId is available in the payload but the schema doesn't have a user_id or actor_id column.
            // The schema has: id, entity_id, entity_type, action, change_diff, created_at.
            // I should probably request to add `actor_id` to the schema IF the user wanted it, but they didn't ask.
            // However, the `change_diff` example I'm using is valid for the current schema.
        });

        console.log(`[Audit Log]: Task ${taskId} status changed by ${userId}`);
    })
}