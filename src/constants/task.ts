export const TASK_STATUS = {
    CREATED: 'CREATED',
    ASSIGNED: 'ASSIGNED',
    COMPLETED: 'COMPLETED',
    OVERDUE: 'OVERDUE',
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export const TASK_STATUS_LIST = Object.values(TASK_STATUS) as [
    TaskStatus,
    ...TaskStatus[]
];
export const TASK_PRIORITY = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
} as const;

export type TaskPriority = typeof TASK_PRIORITY[keyof typeof TASK_PRIORITY];

export const TASK_PRIORITY_LIST = Object.values(TASK_PRIORITY) as [
    TaskPriority,
    ...TaskPriority[]
];