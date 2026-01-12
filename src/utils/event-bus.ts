import { EventEmitter } from 'events';

// This is a singleton instance
export const eventBus = new EventEmitter();

export const DOMAIN_EVENTS = {
    TASK: {
        CREATED: 'task:created',
        STATUS_CHANGED: 'task:status_changed',
    },
    ORG: {
        USER_INVITED: 'org:user_invited',
    }
} as const;