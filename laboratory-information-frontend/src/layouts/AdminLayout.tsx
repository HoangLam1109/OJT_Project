
import type { AdminLayoutProps } from '../pages/admin/types/AdminTypes';
import { Sidebar } from '../components/common/Sidebar';
import { useState } from 'react';
import { LayoutDashboard, Users, FileText, Settings , UserCheck } from 'lucide-react';
import { TopHeader } from '../components/common/TopHeader';
import type { NavigationItem } from '../types/Layout.types';

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'user-management', label: 'Quản lý người dùng', icon: Users },
  { id: 'patient-management', label: 'Quản lý bệnh nhân', icon: UserCheck },
  {
    id: 'test-orders',
    label: 'Quản lý đơn xét nghiệm',
    icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10,9 9,9 8,9" /></svg>
  },
  { id: 'audit-reports', label: 'Nhật ký sự kiện', icon: FileText },
  { id: 'profile', label: 'Hồ sơ cá nhân', icon: Settings },
];

export function AdminLayout({ children, currentUser, onLogout, currentPage, onNavigate }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentUserName={currentUser.name}
        currentUserRole="Quản trị viên"
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
        <TopHeader />
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
