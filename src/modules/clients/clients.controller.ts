import { NextFunction, Request, Response } from "express";
import { CreateClientInput, UpdateClientInput } from "./clients.schema";
import { ClientService } from "./clients.service";
import { ApiResponse } from "../../utils/api-response";

const createClient = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const orgId = req.org?.id!;
    const payload = req.body as CreateClientInput;

    const result = await ClientService.createClient(payload, orgId);

    return ApiResponse.success(
        res,
        result,
        "Client created successfully",
        201
    );
};

const getClients = async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.org?.id!;
    const clients = await ClientService.getClients(orgId);

    return ApiResponse.success(
        res,
        clients,
        "Clients fetched successfully",
        200
    );
};

const getClientById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { clientId } = req.params;
    const orgId = req.org?.id!;

    const client = await ClientService.getClientById(clientId, orgId);

    return ApiResponse.success(
        res,
        client,
        "Client fetched successfully",
        200
    );
};

const updateClient = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { clientId } = req.params;
    const orgId = req.org?.id!;
    const payload = req.body as UpdateClientInput;

    const result = await ClientService.updateClient(clientId, orgId, payload);

    return ApiResponse.success(
        res,
        result,
        "Client updated successfully",
        200
    );
};

const deleteClient = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { clientId } = req.params;
    const orgId = req.org?.id!;

    const result = await ClientService.deleteClient(clientId, orgId);

    return ApiResponse.success(
        res,
        result,
        "Client deleted successfully",
        200
    );
};

export {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
};
