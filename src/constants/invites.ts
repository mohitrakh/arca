
export const ORG_INVITE_STATUS = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    DECLINED: 'DECLINED',
    EXPIRED: 'EXPIRED'
} as const;

export type OrgInviteStatus = typeof ORG_INVITE_STATUS[keyof typeof ORG_INVITE_STATUS];

export const ORG_INVITE_VALUES = Object.values(ORG_INVITE_STATUS) as [OrgInviteStatus, ...OrgInviteStatus[]];