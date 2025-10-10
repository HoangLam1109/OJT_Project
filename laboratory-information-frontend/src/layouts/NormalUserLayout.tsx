import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Search, 
  Bell, 
  Menu, 
  ChevronLeft,
  User,
  Calendar,
  CreditCard,
  Download,
  UserCheck
} from 'lucide-react';
import Button from '../components/common/button';
import { Input } from '../components/common/input';
import type { User as UserType } from '../types';

interface NormalUserLayoutProps {
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
    label: 'Trang chủ',
    icon: LayoutDashboard
  },
  {
    id: 'test-results',
    label: 'Kết quả XN',
    icon: FileText
  },
  {
    id: 'appointments',
    label: 'Lịch hẹn',
    icon: Calendar
  },
  {
    id: 'bills',
    label: 'Thanh toán',
    icon: CreditCard
  },
  {
    id: 'downloads',
    label: 'Tải xuống',
    icon: Download
  },
  {
    id: 'profile',
    label: 'Hồ sơ cá nhân',
    icon: UserCheck
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: Settings
  }
];

export function NormalUserLayout({ children, currentUser, onLogout, currentPage, onNavigate }: NormalUserLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNavigate = (page: string) => {
    onNavigate(page);
  };

  // Mock notifications for normal user
  const notifications = [
    { id: '1', title: 'Kết quả XN máu đã có', type: 'success', time: '2 giờ trước' },
    { id: '2', title: 'Nhắc nhở lịch hẹn ngày mai', type: 'info', time: '4 giờ trước' },
    { id: '3', title: 'Hóa đơn mới cần thanh toán', type: 'warning', time: '1 ngày trước' }
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
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
              <span className="font-bold text-gray-900">Portal Bệnh nhân</span>
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
                  Bệnh nhân
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
              Portal Bệnh nhân
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kết quả, hóa đơn..."
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
                    <h3 className="font-medium text-gray-900">Thông báo</h3>
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
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
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