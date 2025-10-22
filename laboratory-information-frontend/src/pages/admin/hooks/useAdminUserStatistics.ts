import { useMemo } from 'react';
import type { AdminUser, AdminUserStatistics } from '../types/AdminTypes';

export function useAdminUserStatistics(users: AdminUser[]): AdminUserStatistics {
  return useMemo(() => {
    const total = users.length;
    const active = users.filter(user => user.active).length;
    const inactive = total - active;

    const byRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      active,
      inactive,
      byRole,
    };
  }, [users]);
}

