import express from "express";
import { validate } from "../../middleware/validate";
import { addUsersToProject, createProject, deleteProject, fetchUserOfProjects, getAllProjects, getProjectById, removeUsersFromProject, updateProject } from "./projects.controller";
import { resolveOrganization } from "../../middleware/resolve-organization";
import { requireAuth } from "../../middleware/require-auth";
import { addMembersToProjectSchema, createProjectSchema, updateProjectSchema } from "./project.schema";
import { requireOrgMember } from "../../middleware/require-org-member";
import { requireProjectRole } from "../../middleware/require-project-role";
import { requireProjectMember } from "../../middleware/require-project-member";

const projectRouter = express.Router();

// create project
projectRouter.post("/", requireAuth, resolveOrganization, requireOrgMember, validate(createProjectSchema), createProject);

// get all projects
projectRouter.get("/", requireAuth, resolveOrganization, requireOrgMember, getAllProjects);

// update project
projectRouter.put("/:projectId", requireAuth, resolveOrganization, requireOrgMember, requireProjectMember, requireProjectRole(['PROJECT_MANAGER']), validate(updateProjectSchema), updateProject);

// add user to project
projectRouter.post("/:projectId/members", requireAuth, resolveOrganization, requireOrgMember, requireProjectMember, requireProjectRole(['PROJECT_MANAGER']), validate(addMembersToProjectSchema), addUsersToProject);

// remove user from project
projectRouter.post("/:projectId/members/remove", requireAuth, resolveOrganization, requireOrgMember, requireProjectMember, requireProjectRole(['PROJECT_MANAGER']), validate(addMembersToProjectSchema), removeUsersFromProject);

// fetch users of project
projectRouter.get("/:projectId/members", requireAuth, resolveOrganization, requireOrgMember, requireProjectMember, fetchUserOfProjects);

// delete project
projectRouter.delete("/:projectId", requireAuth, resolveOrganization, requireOrgMember, requireProjectMember, requireProjectRole(['PROJECT_MANAGER']), deleteProject);

// get project by id
projectRouter.get("/:projectId", requireAuth, resolveOrganization, requireOrgMember, requireProjectMember, getProjectById);

export default projectRouter;
