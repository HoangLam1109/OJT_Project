
import Button from './button';
import { ChevronLeft, Menu, Shield, User } from 'lucide-react';
import type { SidebarProps } from '../../types/Layout.types';
import { LogoutButton } from './LogoutButton';


export function Sidebar({
  currentUserName,
  currentUserRole,
  currentPage,
  sidebarCollapsed,
  setSidebarCollapsed,
  onNavigate,
  navigationItems,
}: SidebarProps) {
  return (
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
              onClick={() => onNavigate(item.id)}
            >
              <item.icon className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'} ${
                isActive ? 'text-white' : 'text-gray-500'
              }`} />
              {!sidebarCollapsed && <span className="flex-1 text-left">{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="p-4 border-t border-gray-200 space-y-3 flex-shrink-0">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUserName}</p>
              <p className="text-xs text-gray-500 truncate">{currentUserRole}</p>
            </div>
          </div>
        )}
          <div className="flex items-center gap-3">
        <LogoutButton />
      </div>
        
      </div>
    </div>
  );
}
