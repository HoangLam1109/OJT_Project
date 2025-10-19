import type { User as UserType} from "../pages/login/types/User";

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface TopHeaderProps {
  currentUser: UserType;
}

export interface SidebarProps {
  currentUserName: string;
  currentUserRole: string;
  currentPage: string;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  onNavigate: (page: string) => void;
  navigationItems: NavigationItem[];
  onLogout: () => void;
}