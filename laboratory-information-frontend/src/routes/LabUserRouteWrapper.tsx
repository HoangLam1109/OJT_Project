import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LabUserLayout } from '../layouts/LabUserLayout';
import { TestOrderActionsProvider, useTestOrderActions } from '../context/TestOrderActionsContext';
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
  const navigate = useNavigate();
  const { onCreateTestOrder } = useTestOrderActions();

  // Default navigation function that always works - navigate to create test order page
  const defaultCreateTestOrder = React.useCallback(() => {
    navigate('/labuser/create-test-order');
  }, [navigate]);

  // Always use default function - it will navigate regardless of which page we're on
  // The context function from TestOrdersPage is optional and can override if needed
  const handleCreateTestOrder = React.useMemo(() => {
    // If context provides a function and it's different from default, use it
    // Otherwise, always use default to ensure navigation works from any page
    return defaultCreateTestOrder;
  }, [defaultCreateTestOrder]);

  return (
    <LabUserLayout
      currentUser={currentUser}
      onLogout={onLogout}
      currentPage={currentPage}
      onNavigate={onNavigate}
      onCreateTestOrder={handleCreateTestOrder}
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

