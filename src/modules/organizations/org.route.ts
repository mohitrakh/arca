import express from "express";
import { validate } from "../../middleware/validate";
import { createOrgSchema } from "./org.schema";
import {
  addMembersToOrg,
  createOrganization,
  getOrganizations,
} from "./org.controller";
import { requireAuth } from "../../middleware/require-auth";
import { resolveOrganization } from "../../middleware/resolve-organization";

const orgRouter = express.Router();

// create organization
orgRouter.post("/", validate(createOrgSchema), requireAuth, createOrganization);
orgRouter.get("/", requireAuth, getOrganizations);
orgRouter.post(
  "/:id/members",
  requireAuth,
  resolveOrganization,
  addMembersToOrg
);

export default orgRouter;
