import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  TestTube2, 
  FileText, 
  Settings, 
  Search, 
  Bell, 
  Menu, 
  ChevronLeft,
  Shield,
  Activity,
  AlertTriangle,
  User
} from 'lucide-react';
import Button from '../components/common/button';
import { Input } from '../components/common/input';
import { Card } from '../components/common/card';
import type { User as UserType } from '../features/login/types/User';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentUser: UserType;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Tổng quan',
    icon: LayoutDashboard
  },
  {
    id: 'user-management',
    label: 'Quản lý người dùng',
    icon: Users
  },
  {
    id: 'patient-management',
    label: 'Quản lý bệnh nhân',
    icon: UserCheck
  },
  {
    id: 'test-management',
    label: 'Quản lý xét nghiệm',
    icon: TestTube2
  },
  {
    id: 'audit-reports',
    label: 'Báo cáo & Kiểm toán',
    icon: FileText
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: Settings
  }
];

export function AdminLayout({ children, currentUser, onLogout, currentPage, onNavigate }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNavigate = (page: string) => {
    onNavigate(page);
  };

  // Mock notifications
  const notifications = [
    { id: '1', title: 'Instrument Sync Failed', type: 'error', time: '5 min ago' },
    { id: '2', title: 'Critical Flag Alert', type: 'warning', time: '10 min ago' },
    { id: '3', title: 'New Test Result Ready', type: 'info', time: '15 min ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } flex flex-col h-screen fixed left-0 top-0 z-40`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <span className="font-bold text-gray-900">Quản lý Phòng thí nghiệm</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2"
          >
            {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            // Determine if this navigation item should be highlighted
            const isActive = currentPage === item.id || 
              (item.id === 'user-management' && currentPage === 'add-user');
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start px-3 py-2 h-auto ${
                  sidebarCollapsed ? 'px-2' : ''
                } ${
                  isActive
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleNavigate(item.id)}
              >
                <item.icon className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'} ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`} />
                {!sidebarCollapsed && (
                  <span className="flex-1 text-left">{item.label}</span>
                )}
              </Button>
            );
          })}
        </nav>

        {/* User info and logout at bottom */}
        <div className="p-4 border-t border-gray-200 space-y-3 flex-shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser.role}
                </p>
              </div>
            </div>
          )}
          
          <Button
            variant="outline"
            className={`w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 ${
              sidebarCollapsed ? 'px-2' : ''
            }`}
            onClick={onLogout}
          >
            {sidebarCollapsed ? (
              <Shield className="h-4 w-4" />
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Đăng xuất
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Hệ thống Quản lý Phòng thí nghiệm</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm bệnh nhân, xét nghiệm, người dùng..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>

                {showNotifications && (
                  <Card className="absolute right-0 mt-2 w-80 p-4 shadow-lg z-50">
                    <h3 className="font-semibold text-gray-900 mb-3">Thông báo</h3>
                    <div className="space-y-3">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="flex items-start space-x-3">
                          <div className={`p-1 rounded-full ${
                            notif.type === 'error' ? 'bg-red-100' :
                            notif.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                          }`}>
                            {notif.type === 'error' ? (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            ) : notif.type === 'warning' ? (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            ) : (
                              <Activity className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-500">{notif.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* User Info (simple display) */}
              <div className="flex items-center space-x-2 px-3 py-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}