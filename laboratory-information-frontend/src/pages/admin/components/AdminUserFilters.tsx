import { Search, Filter, X } from 'lucide-react';
import Button from '../../../components/common/button';
import { Input } from '../../../components/common/input';
import { Card, CardContent } from '../../../components/common/card';
import type { AdminUserFilters } from '../types/AdminTypes';

interface AdminUserFiltersProps {
  filters: AdminUserFilters;
  onFiltersChange: (filters: AdminUserFilters) => void;
}

export function AdminUserFilters({ filters, onFiltersChange }: AdminUserFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleRoleChange = (value: string) => {
    onFiltersChange({ ...filters, role: value as AdminUserFilters['role'] });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value as AdminUserFilters['status'] });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      role: 'all',
      status: 'all',
    });
  };

  const hasActiveFilters = filters.searchTerm || filters.role !== 'all' || filters.status !== 'all';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, email, số điện thoại, CMND..."
                value={filters.searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="lg:w-48">
            <select
              value={filters.role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="ADMIN">Quản trị viên</option>
              <option value="MANAGER">Quản lý</option>
              <option value="LAB_USER">Nhân viên Lab</option>
              <option value="SERVICE">Dịch vụ</option>
              <option value="USER">Người dùng</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={filters.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="lg:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
            {filters.searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Tìm kiếm: "{filters.searchTerm}"
              </span>
            )}
            {filters.role !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Vai trò: {filters.role}
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Trạng thái: {filters.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

