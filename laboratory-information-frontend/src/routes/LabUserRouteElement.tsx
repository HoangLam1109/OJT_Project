import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LabUserRouteWrapper } from './LabUserRouteWrapper';
import type { User } from '../types/User';

interface LabUserRouteElementProps {
  currentUser: User;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  setLabUserPage: (page: string) => void;
  children: React.ReactNode;
}

export function LabUserRouteElement({
  currentUser,
  onLogout,
  currentPage,
  onNavigate,
  setLabUserPage,
  children,
}: LabUserRouteElementProps) {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.page) {
      setLabUserPage(location.state.page);
    }
  }, [location.state, setLabUserPage]);

  return (
    <LabUserRouteWrapper
      currentUser={currentUser}
      onLogout={onLogout}
      currentPage={currentPage}
      onNavigate={onNavigate}
    >
      {children}
    </LabUserRouteWrapper>
  );
}

