import { z } from 'zod';
import { ORG_ROLES } from '../../constants/roles';

export const createOrgSchema = z.object({
    name: z.string().max(255, "Name must be at most 255 lenght long"),
    description: z
        .string()
        .max(1024, 'Description must be at most 1024 characters')
        .optional(),

})

export type CreateOrgInput = z.infer<typeof createOrgSchema>;

export const addUserToOrgSchema = z.object({
    email: z.email("Invalid email"),
    role: z.enum([ORG_ROLES.ADMIN, ORG_ROLES.MEMBER]),
})

export type AddUserToOrgInput = z.infer<typeof addUserToOrgSchema>;

export const acceptOrgInviteSchema = z.object({
    token: z.string("Invalid token"),
})

export type AcceptOrgInviteInput = z.infer<typeof acceptOrgInviteSchema>;