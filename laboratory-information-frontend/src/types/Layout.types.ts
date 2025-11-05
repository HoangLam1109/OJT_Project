
export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  dropdownItems?: DropdownItem[];
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