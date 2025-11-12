import { LabUserRouteWrapper } from './LabUserRouteWrapper';
import type { User } from '../types/User';

interface LabUserRouteElementProps {
  currentUser: User;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  setLabUserPage?: (page: string) => void; // Kept for compatibility but not used
  children: React.ReactNode;
}

export function LabUserRouteElement({
  currentUser,
  onLogout,
  currentPage,
  onNavigate,
  children,
}: LabUserRouteElementProps) {
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

