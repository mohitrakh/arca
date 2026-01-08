import { z } from 'zod'


export const createProjectSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().min(1).max(255),
    organization_id: z.string().optional(),
    client_id: z.string().optional(),
    start_date: z.coerce.date().optional(),
    end_date: z.coerce.date().optional(),
    tech_stack: z.array(z.string()).optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
