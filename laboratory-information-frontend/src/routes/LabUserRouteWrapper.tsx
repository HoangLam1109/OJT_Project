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

export function LabUserRouteWrapper({
  currentUser,
  onLogout,
  currentPage,
  onNavigate,
  children,
}: LabUserRouteWrapperProps) {
  return (
    <TestOrderActionsProvider>
      <LabUserLayout
        currentUser={currentUser}
        onLogout={onLogout}
        currentPage={currentPage}
        onNavigate={onNavigate}
      >
        {children}
      </LabUserLayout>
    </TestOrderActionsProvider>
  );
}

