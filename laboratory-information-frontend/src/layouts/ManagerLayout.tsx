import { useState } from 'react';
import { Users, LayoutDashboard, Settings, User as UserIcon } from 'lucide-react';
import { Sidebar } from '../components/common/Sidebar';
import { TopHeader } from '../components/common/TopHeader';
import type { NavigationItem } from '../types/Layout.types';
import type { User } from '../types/User';

const navigationItems: NavigationItem[] = [
  { id: 'user-management', label: 'Quản lý người dùng', icon: Users },
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'settings', label: 'Cài đặt', icon: Settings },
  { id: 'profile', label: 'Hồ sơ cá nhân', icon: UserIcon },
  { id: 'instruments', label: 'Quản lý Thiết bị', icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg> },
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
        currentUserRole="Quản lý"
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
        <TopHeader/>
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

