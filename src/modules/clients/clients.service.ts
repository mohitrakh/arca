import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { clientTable } from "../../db/schema/clients";
import { AppError } from "../../utils/app-error";
import { CreateClientInput, UpdateClientInput } from "./clients.schema";

export class ClientService {
    static async createClient(payload: CreateClientInput, orgId: string) {
        const [result] = await db
            .insert(clientTable)
            .values({
                ...payload,
                organization_id: orgId,
            })
            .$returningId();

        return result;
    }

    static async getClients(orgId: string) {
        return await db
            .select()
            .from(clientTable)
            .where(eq(clientTable.organization_id, orgId));
    }

    static async getClientById(clientId: string, orgId: string) {
        const [client] = await db
            .select()
            .from(clientTable)
            .where(
                and(
                    eq(clientTable.id, clientId),
                    eq(clientTable.organization_id, orgId)
                )
            );

        if (!client) {
            throw new AppError("Client not found", 404);
        }

        return client;
    }

    static async updateClient(
        clientId: string,
        orgId: string,
        payload: UpdateClientInput
    ) {
        const [client] = await db
            .select()
            .from(clientTable)
            .where(
                and(
                    eq(clientTable.id, clientId),
                    eq(clientTable.organization_id, orgId)
                )
            );

        if (!client) {
            throw new AppError("Client not found", 404);
        }

        await db
            .update(clientTable)
            .set({
                ...payload,
                updated_at: new Date(),
            })
            .where(
                and(
                    eq(clientTable.id, clientId),
                    eq(clientTable.organization_id, orgId)
                )
            );

        return { id: clientId };
    }

    static async deleteClient(clientId: string, orgId: string) {
        const [client] = await db
            .select()
            .from(clientTable)
            .where(
                and(
                    eq(clientTable.id, clientId),
                    eq(clientTable.organization_id, orgId)
                )
            );

        if (!client) {
            throw new AppError("Client not found", 404);
        }

        await db
            .delete(clientTable)
            .where(
                and(
                    eq(clientTable.id, clientId),
                    eq(clientTable.organization_id, orgId)
                )
            );

        return { id: clientId };
    }
}
