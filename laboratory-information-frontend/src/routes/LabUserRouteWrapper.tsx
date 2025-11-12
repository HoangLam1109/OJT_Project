import React from 'react';
import { LabUserLayout } from '../layouts/LabUserLayout';
import { TestOrderActionsProvider } from '../context/TestOrderActionsContext';
import type { User } from '../types/User';

interface LabUserRouteWrapperProps {
  currentUser: User;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

function LabUserLayoutWithActions({
  currentUser,
  onLogout,
  currentPage,
  onNavigate,
  children,
}: LabUserRouteWrapperProps) {
  return (
    <LabUserLayout
      currentUser={currentUser}
      onLogout={onLogout}
      currentPage={currentPage}
      onNavigate={onNavigate}
    >
      {children}
    </LabUserLayout>
  );
}

export function LabUserRouteWrapper(props: LabUserRouteWrapperProps) {
  return (
    <TestOrderActionsProvider>
      <LabUserLayoutWithActions {...props} />
    </TestOrderActionsProvider>
  );
}

