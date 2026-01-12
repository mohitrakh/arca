import cron from 'node-cron';
import { db } from '../../db';
import { eq, and, lt, ne } from 'drizzle-orm';
import { eventBus, DOMAIN_EVENTS } from '../../utils/event-bus';
import { taskTable } from '../../db/schema/tasks';

export const initTaskScheduler = () => {
    // Runs every hour at minute 0 (0 * * * *)
    cron.schedule('0 * * * *', async () => {
        console.log('⏰ Running Overdue Task Check...');

        const now = new Date();

        try {
            // 1. Find all tasks that are past due but not yet marked Overdue/Done
            const overdueTasks = await db.select()
                .from(taskTable)
                .where(
                    and(
                        lt(taskTable.due_date, now),
                        ne(taskTable.status, 'COMPLETED'),
                        ne(taskTable.status, 'OVERDUE')
                    )
                );

            if (overdueTasks.length === 0) return;

            // 2. Update them to 'OVERDUE'
            await db.update(taskTable)
                .set({ status: 'OVERDUE' })
                .where(
                    and(
                        lt(taskTable.due_date, now),
                        ne(taskTable.status, 'COMPLETED'),
                        ne(taskTable.status, 'OVERDUE')
                    )
                );

            // 3. Emit Events for the Audit Log and Notifications
            overdueTasks.forEach((task) => {
                eventBus.emit(DOMAIN_EVENTS.TASK.STATUS_CHANGED, {
                    taskId: task.id,
                    userId: 'SYSTEM', // Marked as system action
                    oldStatus: task.status,
                    newStatus: 'OVERDUE',
                });
            });

            console.log(`✅ Marked ${overdueTasks.length} tasks as overdue.`);
        } catch (error) {
            console.error('❌ Scheduler Error:', error);
        }
    });
};