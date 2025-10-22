import { useState, useMemo } from 'react';
import type { ManagerUser, UserFilters } from '../types/ManagerTypes';

export function useUserFilters(users: ManagerUser[]) {
  const [filters, setFilters] = useState<UserFilters>({
    searchTerm: '',
    role: 'all',
    status: 'all',
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        !filters.searchTerm ||
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone_number?.toLowerCase().includes(searchLower);

      // Role filter
      const matchesRole = filters.role === 'all' || user.role === filters.role;

      // Status filter
      const matchesStatus =
        filters.status === 'all' ||
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

