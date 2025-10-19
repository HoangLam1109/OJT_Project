
import type { AdminLayoutProps } from '../types/AdminTypes';
import { Sidebar } from '../components/common/Sidebar';
import { useState } from 'react';
import { LayoutDashboard, Users, FileText, Settings, TestTube2, UserCheck } from 'lucide-react';
import { TopHeader } from '../components/common/TopHeader';
import type { NavigationItem } from '../types/types';

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'user-management', label: 'Quản lý người dùng', icon: Users },
  { id: 'patient-management', label: 'Quản lý bệnh nhân', icon: UserCheck },
  { id: 'test-management', label: 'Quản lý xét nghiệm', icon: TestTube2 },
  { id: 'audit-reports', label: 'Báo cáo & Kiểm toán', icon: FileText },
  { id: 'settings', label: 'Cài đặt', icon: Settings },
];

export function AdminLayout({ children, currentUser, onLogout, currentPage, onNavigate }: AdminLayoutProps) {
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
