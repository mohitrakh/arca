import { z } from 'zod';

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
