import { NextFunction, Request, Response } from "express";
import OrganizatonService from "./org.service";
import { ApiResponse } from "../../utils/api-response";
import { AppError } from "../../utils/app-error";

const createOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.auth?.userId!;
  const org = await OrganizatonService.createOrg(req.body, userId);
  return ApiResponse.success(
    res,
    org,
    "Successfully created organization",
    201
  );
};

const getOrganizations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.auth?.userId!;
  const orgs = await OrganizatonService.getOrgs(userId);
  return ApiResponse.success(
    res,
    orgs,
    "Successfully fetched organizations",
    200
  );
};

const addMembersToOrg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.auth?.userId!;
  const memberId = req.params.id;
  const orgId = req.org?.id!;
  const org = await OrganizatonService.addMembersToOrg(orgId, userId, memberId);
  return ApiResponse.success(
    res,
    org,
    "Successfully added members to organization",
    201
  );
};

const removeMembersFromOrg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRole = req.org?.role!;
  const memberId = req.params.id;
  const orgId = req.org?.id!;
  const org = await OrganizatonService.removeMembersFromOrg(orgId, userRole, memberId);
  return ApiResponse.success(
    res,
    org,
    "Successfully removed members from organization",
    201
  );
};

export { createOrganization, getOrganizations, addMembersToOrg, removeMembersFromOrg };
