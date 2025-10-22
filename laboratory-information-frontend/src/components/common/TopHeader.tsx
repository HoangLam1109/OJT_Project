
import { Search, User } from 'lucide-react';
import { Input } from './input';
import type { TopHeaderProps } from '../../types/Layout.types';


export function TopHeader({ currentUser }: TopHeaderProps) {

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
