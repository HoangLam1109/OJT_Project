import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wrench, 
  Package, 
  Settings, 
  Search, 
  Bell, 
  Menu, 
  ChevronLeft,
  User,
  Calendar,
  FileText,
  Hammer
} from 'lucide-react';
import Button from '../components/common/button';
import { Input } from '../components/common/input';
import type { User as UserType } from '../types';

interface ServiceLayoutProps {
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
    label: 'Tổng quan Bảo trì',
    icon: LayoutDashboard
  },
  {
    id: 'equipment',
    label: 'Quản lý Thiết bị',
    icon: Wrench
  },
  {
    id: 'maintenance',
    label: 'Lịch Bảo trì',
    icon: Calendar
  },
  {
    id: 'inventory',
    label: 'Kho Vật tư',
    icon: Package
  },
  {
    id: 'tickets',
    label: 'Phiếu Yêu cầu',
    icon: FileText
  },
  {
    id: 'tools',
    label: 'Công cụ Hỗ trợ',
    icon: Hammer
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: Settings
  }
];

export function ServiceLayout({ children, currentUser, onLogout, currentPage, onNavigate }: ServiceLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNavigate = (page: string) => {
    onNavigate(page);
  };

  // Mock notifications for service
  const notifications = [
    { id: '1', title: 'Máy XN001 cần bảo trì khẩn cấp', type: 'error', time: '2 phút trước' },
    { id: '2', title: 'Hoàn thành bảo trì máy XN005', type: 'success', time: '30 phút trước' },
    { id: '3', title: 'Thiếu vật tư thay thế', type: 'warning', time: '1 giờ trước' }
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
              <div className="p-2 bg-orange-100 rounded-lg">
                <Wrench className="h-6 w-6 text-orange-600" />
              </div>
              <span className="font-bold text-gray-900">Bảo trì & Dịch vụ</span>
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
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start px-3 py-2 h-auto ${
                  sidebarCollapsed ? 'px-2' : ''
                } ${
                  isActive
                    ? 'bg-orange-600 text-white hover:bg-orange-700' 
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
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Kỹ thuật viên Bảo trì
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
              <User className="h-4 w-4" />
            ) : (
              'Đăng xuất'
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Hệ thống Bảo trì Thiết bị
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm thiết bị, phiếu bảo trì..."
                className="pl-10 w-64"
              />
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              </Button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900">Thông báo Bảo trì</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'error' ? 'bg-red-500' :
                            notification.type === 'warning' ? 'bg-yellow-500' :
                            notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">{currentUser.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}