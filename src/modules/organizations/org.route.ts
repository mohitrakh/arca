import express from "express";
import { validate } from "../../middleware/validate";
import { acceptOrgInviteSchema, addUserToOrgSchema, createOrgSchema } from "./org.schema";
import {
  acceptMembersToOrg,
  addMembersToOrg,
  createOrganization,
  getOrganizations,
  removeMembersFromOrg,
} from "./org.controller";
import { requireAuth } from "../../middleware/require-auth";
import { resolveOrganization } from "../../middleware/resolve-organization";
import { requireOrgMember } from "../../middleware/require-org-member";

const orgRouter = express.Router();

// create organization
orgRouter.post("/", validate(createOrgSchema), requireAuth, createOrganization);

// get organization
orgRouter.get("/", requireAuth, getOrganizations);

// add members to organization
orgRouter.post(
  "/members",
  requireAuth,
  resolveOrganization,
  validate(addUserToOrgSchema),
  addMembersToOrg
);

// accept members to organization
orgRouter.post(
  "/members/accept",
  requireAuth,
  resolveOrganization,
  validate(acceptOrgInviteSchema),
  acceptMembersToOrg
);

// remove members from organizations
orgRouter.post(
  "/:id/members/remove",
  requireAuth,
  resolveOrganization,
  requireOrgMember,
  removeMembersFromOrg
);

export default orgRouter;
