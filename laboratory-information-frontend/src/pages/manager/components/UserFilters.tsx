import { Search, Filter } from 'lucide-react';
import { Input } from '../../../components/common/input';
import type { UserFilters as UserFiltersType } from '../types/ManagerTypes';
import { useTranslation } from 'react-i18next';
interface UserFiltersProps {
  filters: UserFiltersType;
  onFiltersChange: (filters: UserFiltersType) => void;
}

export function UserFilters({ filters, onFiltersChange }: UserFiltersProps) {
  const { t } = useTranslation();
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleRoleChange = (value: string) => {
    onFiltersChange({ ...filters, role: value as UserFiltersType['role'] });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value as UserFiltersType['status'] });
  };

  return (
    <div 
      className="rounded-lg p-6 shadow-sm" 
      style={{ 
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb'
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5" style={{ color: '#374151' }} />
        <h3 className="font-semibold text-lg" style={{ color: '#111827' }}>
          {t('manager.filters')}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search */}
        <div>
          <label 
            htmlFor="search" 
            className="block text-sm font-semibold mb-2"
            style={{ color: '#111827' }}
          >
            {t('manager.search')}
          </label>
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 w-4 h-4" 
              style={{ 
                transform: 'translateY(-50%)',
                color: '#6b7280'
              }} 
            />
            <Input
              id="search"
              type="text"
              placeholder={t('manager.searchPlaceholder')}
              value={filters.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                color: '#111827'
              }}
            />
          </div>
        </div>

        {/* Role Filter */}
        <div>
          <label 
            htmlFor="role" 
            className="block text-sm font-semibold mb-2"
            style={{ color: '#111827' }}
          >
            {t('manager.role')}
          </label>
          <select
            id="role"
            value={filters.role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none focus:ring-2"
            style={{
              height: '2.5rem',
              backgroundColor: '#ffffff',
              border: '2px solid #d1d5db',
              color: '#111827',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="all" style={{ color: '#111827', backgroundColor: '#ffffff' }}>
              {t('manager.allRoles')}
            </option>
            <option value="ADMIN" style={{ color: '#111827', backgroundColor: '#ffffff' }}>
              {t('manager.admin')}
            </option>
            <option value="MANAGER" style={{ color: '#111827', backgroundColor: '#ffffff' }}>
              {t('manager.manager')}
            </option>
            <option value="LAB_USER" style={{ color: '#111827', backgroundColor: '#ffffff' }}>
              {t('manager.labUser')}
            </option>
            <option value="SERVICE" style={{ color: '#111827', backgroundColor: '#ffffff' }}>
              {t('manager.service')}
            </option>
            <option value="USER" style={{ color: '#111827', backgroundColor: '#ffffff' }}>
              {t('manager.user')}
            </option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label 
            htmlFor="status" 
            className="block text-sm font-semibold mb-2"
            style={{ color: '#111827' }}
          >
            {t('manager.status')}
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none focus:ring-2"
            style={{
              height: '2.5rem',
              backgroundColor: '#ffffff',
              border: '2px solid #d1d5db',
              color: '#111827',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="all" style={{ color: '#111827', backgroundColor: '#ffffff' }}>
              {t('manager.allStatus')}
            </option>
            <option value="active" style={{ color: '#111827', backgroundColor: '#ffffff' }}>
              {t('manager.active')}
            </option>
            <option value="inactive" style={{ color: '#111827', backgroundColor: '#ffffff' }}>
              {t('manager.inactive')}
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}

