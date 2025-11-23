import { User, Lock, Unlock, Edit, Trash2, Eye, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import Button from '../../../components/common/button';
import type { ManagerUser } from '../types/ManagerTypes';
import {useTranslation} from 'react-i18next';
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
  const { t } = useTranslation();
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
      ADMIN: t('manager.admin'),
      MANAGER: t('manager.manager'),
      LAB_USER: t('manager.labUser'),
      SERVICE: t('manager.service'),
      USER: t('manager.user'),
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
      <div className="text-center py-8 sm:py-12 px-4">
        <User className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4" />
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
          {t('manager.noUsersFound')}
        </h3>
        <p className="text-sm sm:text-base text-gray-500">
          {t('manager.noUsersFoundDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 whitespace-nowrap">
              {t('manager.user')}
            </th>
            <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 whitespace-nowrap">
              {t('manager.role')}
            </th>
            <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 whitespace-nowrap hidden md:table-cell">
              {t('manager.contact')}
            </th>
            <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 whitespace-nowrap">
              {t('manager.status')}
            </th>
            <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 whitespace-nowrap hidden lg:table-cell">
              {t('manager.lastLogin')}
            </th>
            <th className="text-right py-2 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm text-gray-700 whitespace-nowrap">
              {t('manager.actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-2 sm:py-3 px-3 sm:px-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                    {user.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                      {user.name || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user.email || 'N/A'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-2 sm:py-3 px-3 sm:px-4">
                <span
                  className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                    Array.isArray(user.role) ? user.role[0] : user.role
                  )}`}
                >
                  {getRoleLabel(Array.isArray(user.role) ? user.role[0] : user.role)}
                </span>
              </td>
              <td className="py-2 sm:py-3 px-3 sm:px-4 hidden md:table-cell">
                <div className="text-xs sm:text-sm">
                  <div className="text-gray-900 truncate max-w-[120px]">
                    {user.phone_number || 'N/A'}
                  </div>
                  <div className="text-gray-500 text-xs truncate max-w-[120px]">
                    {t('manager.identifyNumber')}: {user.identify_number || 'N/A'}
                  </div>
                </div>
              </td>
              <td className="py-2 sm:py-3 px-3 sm:px-4">
                <span
                  className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      user.active ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  />
                  <span className="whitespace-nowrap">{user.active ? t('manager.active') : t('manager.inactive')}</span>
                </span>
              </td>
              <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-600 hidden lg:table-cell">
                <div className="whitespace-nowrap">{formatDate(user.lastLogin)}</div>
              </td>
              <td className="py-2 sm:py-3 px-3 sm:px-4">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(user)}
                    title={t('manager.viewDetails')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(user)}
                    title={t('manager.edit')}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleLock(user)}
                    title={user.active ? t('manager.lockAccount') : t('manager.unlockAccount')}
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
                    title={t('manager.deleteUser')}
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 px-4 border-t border-gray-200">
          <div className="text-xs sm:text-sm text-gray-600">
            {pageLabel}
          </div>
          <div className="flex items-center gap-1">
            {onFirstPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onFirstPage}
                title={t('manager.firstPage')}
                disabled={hasPrev === false}
                className="hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
            )}
            {onPrevPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevPage}
                title={t('manager.previousPage')}
                disabled={hasPrev === false}
                className="hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            {onNextPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onNextPage}
                title={t('manager.nextPage')}
                disabled={hasNext === false}
                className="hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
            {onLastPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onLastPage}
                title={t('manager.lastPage')}
                disabled={hasNext === false}
                className="hover:bg-blue-100 hover:text-blue-700 transition-colors"
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

