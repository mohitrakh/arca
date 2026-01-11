# Project Status: Multi-Tenant Client–Project–Task Workflow

This document tracks the current implementation status of the modular monolith system.

## ✅ Completed (Done)

### 1. Database Schema
- **Tables Created**:
  - `organizations` (Tenant root)
  - `users` (Global users)
  - `clients` (Customer entities)
  - `projects` (Work units)
  - `tasks` (Work items)
  - `organization_memberships` (User-Org mapping)
  - `project_memberships` (User-Project mapping)

### 2. Core Infrastructure & Middleware
- **Authentication**: JWT-based auth flow (`auth.ts`).
- **Multi-Tenancy**:
  - `resolveOrganization` middleware extracts `x-org-id`.
  - Database queries are scoped by `organization_id`.
- **Authorization (RBAC)**:
  - Role constants defined (`ORG_ROLES`, `PROJECT_ROLES`).
  - `requireProjectMember` middleware enforces project access.

### 3. Task Module (Basic)
- **CRUD Operations**: Create, Read (List with pagination), Update, Delete.
- **Status Updates**: Basic status modification endpoint.
- **Filtering**: Basic filter logic setup.

---

## 🚧 Remaining (To Do)

The following areas require implementation to meet the core "Resume-First / Advanced" goals of the project.

### 1. Client Management Module (Missing)
The `clients` table exists, but there is no API module to manage them.
- **Action**: Create `src/modules/clients`.
- **Features needed**:
  - Create Client (Linked to Org).
  - List Clients.
  - Update/Archive Client.


### 3. Domain Events System (The "Async" Core)
No event bus exists yet. This is critical for decoupling logic.
- **Action**: Create an Event Bus (e.g., `src/core/event-bus.ts` or using Node's `EventEmitter`).
- **Events to Define**:
  - `TaskCreated`
  - `TaskStatusChanged`
  - `ProjectDeadlineApproaching`
- **Handlers**: Create handlers that listen to these events (e.g., to send emails or log audits).

### 4. Audit Logging
System needs to track "Who did what".
- **Action**:
  - Create `audit_logs` table schema (who, what, entity_id, change_diff).
  - Create an Event Handler that listens to *all* domain events and writes to `audit_logs`.

### 5. Time-Based Logic (Background Jobs)
No scheduler exists for deadline checks.
- **Action**:
  - Set up a scheduler (e.g., `node-cron` or `bullmq`).
  - Create a job: `checkOverdueTasks` runs hourly -> updates status to `OVERDUE` -> triggers `TaskOverdueEvent`.

### 6. Concurrency Control
To prevent "Lost Update" problems when two users edit a task simultaneously.
- **Action**:
  - Add `version` (int) column to `tasks` table.
  - Update `updateTask` to check `version` on write (Optimistic Locking).

### 7. Global Organization & User Management
- **Action**:
  - Implement "Invite User to Organization" flow.
  - Implement "Assign Project Role" API.
