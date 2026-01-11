import { z } from "zod";

export const createClientSchema = z.object({
    name: z.string().min(1, "Name is required").max(256),
    description: z.string().max(1024).optional(),
});

export const updateClientSchema = z.object({
    name: z.string().min(1).max(256).optional(),
    description: z.string().max(1024).optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
