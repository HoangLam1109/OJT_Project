import { useState } from 'react';
import { Search, Bell, Activity, AlertTriangle, User } from 'lucide-react';
import { Input } from './input';
import Button  from './button';
import { Card } from './card';
import type { TopHeaderProps } from '../../types/types';


export function TopHeader({ currentUser }: TopHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications
  const notifications = [
    { id: '1', title: 'Instrument Sync Failed', type: 'error', time: '5 min ago' },
    { id: '2', title: 'Critical Flag Alert', type: 'warning', time: '10 min ago' },
    { id: '3', title: 'New Test Result Ready', type: 'info', time: '15 min ago' }
  ];

  return (
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

          {/* User Info */}
          <div className="flex items-center space-x-2 px-3 py-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
