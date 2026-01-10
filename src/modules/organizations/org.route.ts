import express from "express";
import { validate } from "../../middleware/validate";
import { createOrgSchema } from "./org.schema";
import {
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
  "/:id/members",
  requireAuth,
  resolveOrganization,
  addMembersToOrg
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
