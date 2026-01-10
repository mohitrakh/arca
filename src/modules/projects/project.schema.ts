import { z } from 'zod'
import { PROJECT_ROLE_VALUES } from '../../constants/roles';


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

export const updateProjectSchema = createProjectSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided for update" }
);

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;


export const addMembersToProjectSchema = z.object({
    members: z.array(
        z.object({
            userId: z.string().min(1, "User ID is required"),
            role: z.enum(PROJECT_ROLE_VALUES)
        })
    ).min(1, "At least one member must be provided")
});

export type AddMembersToProjectInput = z.infer<typeof addMembersToProjectSchema>