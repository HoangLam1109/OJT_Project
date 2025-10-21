import { useState } from 'react';
import { Users, LayoutDashboard, Settings } from 'lucide-react';
import { Sidebar } from '../components/common/Sidebar';
import { TopHeader } from '../components/common/TopHeader';
import type { NavigationItem } from '../types/Layout.types';
import type { User } from '../types/User';

const navigationItems: NavigationItem[] = [
  { id: 'user-management', label: 'Quản lý người dùng', icon: Users },
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'settings', label: 'Cài đặt', icon: Settings },
];

interface ManagerLayoutProps {
  children: React.ReactNode;
  currentUser: User;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function ManagerLayout({ 
  children, 
  currentUser, 
  onLogout, 
  currentPage, 
  onNavigate 
}: ManagerLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentUserName={currentUser.name}
        currentUserRole={currentUser.role}
        currentPage={currentPage}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        onNavigate={onNavigate}
        navigationItems={navigationItems}
        onLogout={onLogout}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <TopHeader currentUser={currentUser} />
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

