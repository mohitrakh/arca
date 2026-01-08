import { z } from 'zod';
import { TASK_PRIORITY_LIST, TASK_STATUS_LIST } from '../../constants/task';

/* ============================================================
   CREATE TASK
   ============================================================ */

export const createTaskSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(256, 'Title must be at most 256 characters'),

    description: z
        .string()
        .max(1024, 'Description must be at most 1024 characters')
        .optional(),

    assigned_to: z
        .string()
        .cuid2('Invalid user ID')
        .optional(),

    priority: z
        .enum(['LOW', 'MEDIUM', 'HIGH'])
        .optional(),

    due_date: z
        .string().refine(
            (val) => !Number.isNaN(Date.parse(val)),
            { message: 'Invalid ISO datetime string' }
        )
        .optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const listTasksQuerySchema = z.object({
    query: z.object({
        // 1. Pagination
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(100).default(10),

        // 2. filters 
        status: z.enum(TASK_STATUS_LIST).optional(),
        priority: z.enum(TASK_PRIORITY_LIST).optional(),
        assigned_to: z.string().optional(),

        // 3. search

        search: z.string().optional(),

        // 4. Sorting

        sortBy: z.enum(['created_at', 'due_date', 'priority']).default('created_at'),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
    })
})

export type ListTasksInput = z.infer<typeof listTasksQuerySchema>["query"];