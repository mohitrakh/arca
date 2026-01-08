import express from 'express'
import { requireAuth } from '../../middleware/require-auth'
import { requireOrgMember } from '../../middleware/require-org-member'
import { requireProjectMember } from '../../middleware/require-project-member'
import { requireProjectRole } from '../../middleware/require-project-role'
import { validate } from '../../middleware/validate'
import { createTask, getTasks } from './tasks.controller'
import { createTaskSchema, listTasksQuerySchema } from './tasks.schema'
import { resolveOrganization } from '../../middleware/resolve-organization'
import { PROJECT_ROLE_VALUES } from '../../constants/roles'

const taskRouter = express.Router()

taskRouter.post(
    '/projects/:projectId/tasks',
    requireAuth,
    resolveOrganization,
    requireOrgMember,
    requireProjectMember,
    requireProjectRole(['PROJECT_MANAGER']),
    validate(createTaskSchema),
    createTask
)

taskRouter.get(
    '/projects/:projectId/tasks',
    requireAuth,
    resolveOrganization,
    requireOrgMember,
    requireProjectMember,
    requireProjectRole(PROJECT_ROLE_VALUES),
    validate(listTasksQuerySchema),
    getTasks
)

export default taskRouter