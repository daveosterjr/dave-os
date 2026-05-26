import { prisma } from '@__APP_SCOPE__/db';

type EnsureWorkspaceInput = {
  clerkUserId: string;
  email: string;
  clerkOrgId: string;
  organizationName: string;
};

export async function ensureWorkspace(input: EnsureWorkspaceInput) {
  const user = await prisma.user.upsert({
    where: { clerkUserId: input.clerkUserId },
    update: { email: input.email },
    create: {
      clerkUserId: input.clerkUserId,
      email: input.email
    }
  });

  const organization = await prisma.organization.upsert({
    where: { clerkOrgId: input.clerkOrgId },
    update: { name: input.organizationName },
    create: {
      clerkOrgId: input.clerkOrgId,
      name: input.organizationName
    }
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: user.id
      }
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: user.id,
      role: 'org:admin'
    }
  });

  return { user, organization };
}
