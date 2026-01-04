/* ============================================================
   ORGANIZATION ROLES
   ============================================================ */

export const ORG_ROLES = {
    ADMIN: 'ORG_ADMIN',
    MEMBER: 'MEMBER',
} as const;

export type OrgRole = typeof ORG_ROLES[keyof typeof ORG_ROLES];

// Drizzle / DB compatible enum values
export const ORG_ROLE_VALUES = Object.values(ORG_ROLES) as [
    OrgRole,
    ...OrgRole[]
];


/* ============================================================
   PROJECT ROLES
   ============================================================ */

export const PROJECT_ROLES = {
    MANAGER: 'PROJECT_MANAGER',
    DEVELOPER: 'DEVELOPER',
    DESIGNER: 'DESIGNER',
    TESTER: 'TESTER',
} as const;

export type ProjectRole = typeof PROJECT_ROLES[keyof typeof PROJECT_ROLES];

// Drizzle / DB compatible enum values
export const PROJECT_ROLE_VALUES = Object.values(PROJECT_ROLES) as [
    ProjectRole,
    ...ProjectRole[]
];


/* ============================================================
   OPTIONAL: COMBINED ROLE TYPE (if ever needed)
   ============================================================ */

export type AnyRole = OrgRole | ProjectRole;
