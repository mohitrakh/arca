import crypto from 'crypto';
import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { organizationTable } from "../../db/schema/organization";
import { CreateOrgInput } from "./org.schema";
import { orgMembershipTable } from "../../db/schema/orgMembership";
import { ORG_ROLES, OrgRole } from "../../constants/roles";
import { AppError } from "../../utils/app-error";
import { userTable } from "../../db/schema/users";
import { organizationInvitesTable } from "../../db/schema/org-invites";
import { ORG_INVITE_STATUS, OrgInviteStatus } from "../../constants/invites";
import { emailService } from '../../services/email/email.service';
import env from '../../config/env';


export default class OrganizatonService {
  static async createOrg(payload: CreateOrgInput, userId: string) {

    return await db.transaction(async (tx) => {
      const org = await tx.insert(organizationTable).values({
        name: payload.name,
        description: payload.description,
        created_by: userId,
        is_active: true,
      }).$returningId();

      // create relationship as well

      await tx.insert(orgMembershipTable).values({
        organization_id: org[0].id,
        user_id: userId,
        role: ORG_ROLES.ADMIN,
        is_active: true,
        joined_at: new Date(),
      });

      return org;
    });

  }

  static async getOrgs(userId: string) {
    return await db
      .select({
        id: organizationTable.id,
        name: organizationTable.name,
        description: organizationTable.description,
        role: orgMembershipTable.role, // Useful to know what role the user has in that org
      })
      .from(organizationTable)
      .innerJoin(
        orgMembershipTable,
        eq(organizationTable.id, orgMembershipTable.organization_id)
      )
      .where(
        and(
          eq(orgMembershipTable.user_id, userId),
          eq(organizationTable.is_active, true),
          eq(orgMembershipTable.is_active, true) // Usually want to check both
        )
      );
  }

  static async addMembersToOrg(
    email: string,
    orgId: string,
    inviterId: string,
    role: OrgRole = 'MEMBER'
  ) {
    const [org] = await db.select().from(organizationTable).where(eq(organizationTable.id, orgId));
    const isAdmin = await db
      .select()
      .from(orgMembershipTable)
      .where(
        and(
          eq(orgMembershipTable.organization_id, orgId),
          eq(orgMembershipTable.role, ORG_ROLES.ADMIN)
        )
      );

    if (isAdmin.length === 0) {
      throw new AppError("User is not an admin of the organization", 400);
    }

    const [existingUser] = await db.select().from(userTable).where(eq(userTable.email, email));

    if (existingUser) {
      const [membership] = await db.select().from(orgMembershipTable).where(
        and(
          eq(orgMembershipTable.organization_id, orgId),
          eq(orgMembershipTable.user_id, existingUser.id)
        )
      );
      if (membership) throw new AppError("User is already a member", 400);
    }

    // check if the there is already pending invite

    const [pending] = await db.select().from(organizationInvitesTable).where(
      and(

        eq(organizationInvitesTable.organization_id, orgId),
        eq(organizationInvitesTable.email, email),
        eq(organizationInvitesTable.status, ORG_INVITE_STATUS.PENDING as OrgInviteStatus)
      )
    )

    if (pending) throw new AppError("User is already invited", 400);

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.insert(organizationInvitesTable).values({
      organization_id: orgId,
      inviter_id: inviterId,
      email,
      token,
      expires_at: expiresAt,
      role,
      status: ORG_INVITE_STATUS.PENDING as OrgInviteStatus,
    }).$returningId();

    const inviteUrl = `${env.frontendUrl}/accept-invite?token=${token}`;

    const htmlContent = existingUser
      ? `<h1>Join ${org.name}</h1><p>Hi ${existingUser.name}, you've been invited to join <b>${org.name}</b> on Arca.</p><a href="${inviteUrl}">Accept Invitation</a>`
      : `<h1>Welcome to Arca!</h1><p>You've been invited to join <b>${org.name}</b>. Create an account to get started.</p><a href="${inviteUrl}">Register & Join</a>`;

    await emailService.sendHtmlEmail(email, `Invitation to join ${org.name}`, htmlContent);

    return { message: "Invitation sent successfully" };
  }

  static async acceptMembersToOrg(
    token: string,
    userId: string
  ) {
    const [invite] = await db.select().from(organizationInvitesTable).where(
      and(
        eq(organizationInvitesTable.token, token),
        eq(organizationInvitesTable.status, ORG_INVITE_STATUS.PENDING as OrgInviteStatus)
      )
    )

    if (!invite) throw new AppError("Invalid invite", 400);

    return await db.transaction(async (tx) => {
      await tx.insert(orgMembershipTable).values({
        organization_id: invite.organization_id,
        user_id: userId,
        role: invite.role,
        is_active: true,
        joined_at: new Date(),
      });

      await tx.delete(organizationInvitesTable).where(
        eq(organizationInvitesTable.token, token)
      );
    });
  }

  static async removeMembersFromOrg(
    orgId: string,
    userRole: string,
    memberId: string
  ) {
    if (userRole !== ORG_ROLES.ADMIN) {
      throw new AppError("User is not an admin of the organization", 400);
    }
    return await db
      .delete(orgMembershipTable)
      .where(
        and(
          eq(orgMembershipTable.organization_id, orgId),
          eq(orgMembershipTable.user_id, memberId)
        )
      );
  }
}
