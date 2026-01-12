import { eventBus, DOMAIN_EVENTS } from '../../utils/event-bus';

export function initTaskListeners() {
    eventBus.on(DOMAIN_EVENTS.TASK.CREATED, async (data) => {
        const { taskId, userId } = data;

        console.log(`[Audit Log]: Task ${taskId} created by ${userId}`);
        // Here you would call your EmailService or WebSocketService
    });
}