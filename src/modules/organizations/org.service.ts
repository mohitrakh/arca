import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { organizationTable } from "../../db/schema/organization";
import { CreateOrgInput } from "./org.schema";
import { orgMembershipTable } from "../../db/schema/orgMembership";
import { ORG_ROLES, OrgRole } from "../../constants/roles";

export default class OrganizatonService {
  static async createOrg(payload: CreateOrgInput, userId: string) {
    console.log("payload before updating the value", payload, userId);
    const org = await db.insert(organizationTable).values({
      name: payload.name,
      description: payload.description,
      created_by: userId,
      is_active: true,
    }).$returningId();

    // create relationship as well

    await db.insert(orgMembershipTable).values({
      organization_id: org[0].id,
      user_id: userId,
      role: ORG_ROLES.ADMIN,
      is_active: true,
      joined_at: new Date(),
    });

    return org;
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
    orgId: string,
    userId: string,
    memberId: string
  ) {
    const existingMember = await db
      .select()
      .from(orgMembershipTable)
      .where(
        and(
          eq(orgMembershipTable.organization_id, orgId),
          eq(orgMembershipTable.user_id, memberId)
        )
      );

    if (existingMember.length > 0) {
      throw new Error("User is already a member of the organization");
    }

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
      throw new Error("User is not an admin of the organization");
    }

    return await db
      .insert(orgMembershipTable)
      .values({ organization_id: orgId, user_id: memberId, role: ORG_ROLES.MEMBER, is_active: true, joined_at: new Date() })
      .$returningId();
  }
}
