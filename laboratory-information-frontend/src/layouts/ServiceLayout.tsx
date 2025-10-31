import { useState } from 'react';
import {
  LayoutDashboard,
  TestTube,
  Beaker,
  Wrench,
  Activity,
  Settings,
} from 'lucide-react';
import { Sidebar } from '../components/common/Sidebar';
import { TopHeader } from '../components/common/TopHeader';
import type { NavigationItem } from '../types/Layout.types';
import type { User } from '../types/User';


const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'event-logs', label: 'Nhật ký sự kiện', icon: Activity }, 
  { id: 'reagents', label: 'Quản lý hóa chất', icon: Beaker },
  { id: 'instruments', label: 'Quản lý thiết bị', icon: Wrench },
  { id: 'blood-testing', label: 'Thực hiện xét nghiệm', icon: TestTube },
  { id: 'profile', label: 'Hồ sơ cá nhân', icon: Settings },
];


interface ServiceLayoutProps {
  children: React.ReactNode;
  currentUser: User;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function ServiceLayout({ 
  children, 
  currentUser, 
  onLogout, 
  currentPage, 
  onNavigate 
}: ServiceLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentUserName={currentUser.name}
        currentUserRole="Dịch vụ"
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
