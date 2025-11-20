
import { useState } from 'react';
import Button from './button';
import { ChevronLeft, Menu, Shield, User, ChevronDown, Plus } from 'lucide-react';
import type { SidebarProps } from '../../types/Layout.types';
import { LogoutButton } from './LogoutButton'; 
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
export function Sidebar({
  currentUserName,
  currentUserRole,
  currentPage,
  sidebarCollapsed,
  setSidebarCollapsed,
  onNavigate,
  navigationItems,
}: SidebarProps) {
  const navigate = useNavigate();
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const { t } = useTranslation();

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-screen fixed left-0 top-0 z-40`}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        {!sidebarCollapsed && (
          <div
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
            onClick={() => navigate('/')}
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <span className="font-bold text-gray-900">{t('sidebar.title')}</span>
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
          const hasDropdown = item.dropdownItems && item.dropdownItems.length > 0;
          const isDropdownOpen = openDropdowns.has(item.id);

          return (
            <div 
              key={item.id} 
              className="space-y-1"
              onMouseEnter={() => {
                if (hasDropdown && !sidebarCollapsed) {
                  setOpenDropdowns(prev => {
                    const newSet = new Set(prev);
                    newSet.add(item.id);
                    return newSet;
                  });
                }
              }}
              onMouseLeave={() => {
                if (hasDropdown && !sidebarCollapsed) {
                  setOpenDropdowns(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(item.id);
                    return newSet;
                  });
                }
              }}
            >
              <div className="flex items-stretch gap-1">
                <div className="relative flex-1">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`flex w-full items-center justify-start px-3 py-2 ${
                      sidebarCollapsed ? 'px-2' : ''
                    } ${
                      isActive
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    } rounded-md`}
                    onClick={() => {
                      onNavigate(item.id);
                    }}
                  >
                    <item.icon className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'} ${
                      isActive ? 'text-white' : 'text-gray-500'
                    }`} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badgeCount && item.badgeCount > 0 && (
                          <span className="ml-auto inline-flex min-w-[20px] items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                            {item.badgeCount > 9 ? '9+' : item.badgeCount}
                          </span>
                        )}
                      </>
                    )}
                  </Button>
                  {sidebarCollapsed && item.badgeCount && item.badgeCount > 0 && (
                    <span className="pointer-events-none absolute -top-1 -right-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                      {item.badgeCount > 9 ? '9+' : item.badgeCount}
                    </span>
                  )}
                </div>
                {hasDropdown && !sidebarCollapsed && (
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`px-2.5 py-2 min-w-[40px] flex items-center justify-center transition-all pointer-events-none ${
                      isActive 
                        ? 'bg-blue-700 text-white rounded-md' 
                        : 'text-gray-500 rounded-md'
                    }`}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </Button>
                )}
              </div>
              
              {/* Dropdown Items */}
              {hasDropdown && !sidebarCollapsed && isDropdownOpen && (
                <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-2">
                  {item.dropdownItems?.map((dropdownItem) => (
                    <Button
                      key={dropdownItem.id}
                      variant="ghost"
                      className="w-full justify-start px-3 py-2 h-auto text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      onClick={() => {
                        dropdownItem.onClick();
                        setOpenDropdowns(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(item.id);
                          return newSet;
                        });
                      }}
                    >
                      {dropdownItem.icon && (
                        <dropdownItem.icon className="h-4 w-4 mr-2 text-gray-500" />
                      )}
                      {!dropdownItem.icon && <Plus className="h-4 w-4 mr-2 text-gray-500" />}
                      <span className="flex-1 text-left">{dropdownItem.label}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
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
        <LogoutButton collapsed={sidebarCollapsed} />
      </div>
    </div>
  );
}
