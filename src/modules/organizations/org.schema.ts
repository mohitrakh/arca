import { z } from 'zod';

export const createOrgSchema = z.object({
    name: z.string().max(255, "Name must be at most 255 lenght long"),
    description: z
        .string()
        .max(1024, 'Description must be at most 1024 characters')
        .optional(),

})

export type CreateOrgInput = z.infer<typeof createOrgSchema>;