import { User, Lock, Unlock, Edit, Trash2, Eye, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import Button from '../../../components/common/button';
import type { ManagerUser } from '../types/ManagerTypes';

interface UserTableProps {
  users: ManagerUser[];
  onView: (user: ManagerUser) => void;
  onEdit: (user: ManagerUser) => void;
  onDelete: (user: ManagerUser) => void;
  onToggleLock: (user: ManagerUser) => void;
  // Pagination controls for cursor-based navigation
  onFirstPage?: () => void;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  onLastPage?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  pageLabel?: string; // e.g. "Hiển thị 10 người dùng"
}

export function UserTable({ users, onView, onEdit, onDelete, onToggleLock, onFirstPage, onPrevPage, onNextPage, onLastPage, hasPrev, hasNext, pageLabel }: UserTableProps) {
  const getRoleBadgeColor = (role: string) => {
    const colors = {
      ADMIN: 'bg-purple-100 text-purple-800',
      MANAGER: 'bg-blue-100 text-blue-800',
      LAB_USER: 'bg-green-100 text-green-800',
      SERVICE: 'bg-orange-100 text-orange-800',
      USER: 'bg-gray-100 text-gray-800',
    };
    return colors[role as keyof typeof colors] || colors.USER;
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      ADMIN: 'Quản trị viên',
      MANAGER: 'Quản lý',
      LAB_USER: 'Nhân viên Lab',
      SERVICE: 'Dịch vụ',
      USER: 'Người dùng',
    };
    return labels[role as keyof typeof labels] || role;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy người dùng
        </h3>
        <p className="text-gray-500">
          Không có người dùng nào phù hợp với tiêu chí tìm kiếm
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
              Người dùng
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
              Vai trò
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
              Liên hệ
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
              Trạng thái
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
              Đăng nhập cuối
            </th>
            <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.email || 'N/A'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  {getRoleLabel(user.role)}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm">
                  <div className="text-gray-900">
                    {user.phone_number || 'N/A'}
                  </div>
                  <div className="text-gray-500 text-xs">
                    CMND: {user.identify_number || 'N/A'}
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.active ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  />
                  {user.active ? 'Hoạt động' : 'Đã khóa'}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {formatDate(user.lastLogin)}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(user)}
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(user)}
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleLock(user)}
                    title={user.active ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                  >
                    {user.active ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Unlock className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(user)}
                    title="Xóa người dùng"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(onFirstPage || onPrevPage || onNextPage || onLastPage) && (
        <div className="flex items-center justify-between gap-2 py-3 px-2">
          <div className="text-sm text-gray-600">
            {pageLabel}
          </div>
          <div className="flex items-center gap-1">
            {onFirstPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onFirstPage}
                title="Trang đầu"
                disabled={hasPrev === false}
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
            )}
            {onPrevPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevPage}
                title="Trang trước"
                disabled={hasPrev === false}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            {onNextPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onNextPage}
                title="Trang tiếp theo"
                disabled={hasNext === false}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
            {onLastPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onLastPage}
                title="Trang cuối"
                disabled={hasNext === false}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

