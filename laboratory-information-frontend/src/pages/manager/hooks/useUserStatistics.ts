import { useMemo } from 'react';
import type { ManagerUser, UserStatistics } from '../types/ManagerTypes';

export function useUserStatistics(users: ManagerUser[]): UserStatistics {
  return useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.active).length,
      inactive: users.filter(u => !u.active).length,
      byRole: users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }, [users]);
}

