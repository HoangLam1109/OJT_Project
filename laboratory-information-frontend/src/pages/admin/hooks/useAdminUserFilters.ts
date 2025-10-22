import { useState, useMemo } from 'react';
import type { AdminUser, AdminUserFilters } from '../types/AdminTypes';

export function useAdminUserFilters(users: AdminUser[]) {
  const [filters, setFilters] = useState<AdminUserFilters>({
    searchTerm: '',
    role: 'all',
    status: 'all',
  });

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search filter
      const matchesSearch = filters.searchTerm === '' || 
        user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.phone_number?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.identify_number?.toLowerCase().includes(filters.searchTerm.toLowerCase());

      // Role filter
      const matchesRole = filters.role === 'all' || user.role === filters.role;

      // Status filter
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'active' && user.active) ||
        (filters.status === 'inactive' && !user.active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, filters]);

  return {
    filters,
    setFilters,
    filteredUsers,
  };
}

