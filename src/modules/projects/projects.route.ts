import express from "express";
import { validate } from "../../middleware/validate";
import { createProject, getAllProjects } from "./projects.controller";
import { resolveOrganization } from "../../middleware/resolve-organization";
import { requireAuth } from "../../middleware/require-auth";
import { createProjectSchema } from "./project.schema";
import { requireOrgMember } from "../../middleware/require-org-member";

const projectRouter = express.Router();

// create organization
projectRouter.post("/", requireAuth, resolveOrganization, requireOrgMember, validate(createProjectSchema), createProject);

// get all projects
projectRouter.get("/", requireAuth, resolveOrganization, requireOrgMember, getAllProjects);
export default projectRouter;
