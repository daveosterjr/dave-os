'use client';

import { useOrganization, useUser } from '@clerk/nextjs';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

type WorkspaceContextValue = {
  userId: string | null;
  clerkOrgId: string | null;
  organizationName: string | null;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { organization } = useOrganization();

  const value = useMemo<WorkspaceContextValue>(() => ({
    userId: user?.id ?? null,
    clerkOrgId: organization?.id ?? null,
    organizationName: organization?.name ?? null
  }), [organization?.id, organization?.name, user?.id]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used inside WorkspaceProvider');
  }
  return context;
}
