import type { User as UserType } from '../../login/types/User';
import React from 'react';

export interface AdminLayoutProps {
  children: React.ReactNode;
  currentUser: UserType;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

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