import type { User as UserType } from '../pages/login/types/User';
import React from 'react';

export interface AdminLayoutProps {
  children: React.ReactNode;
  currentUser: UserType;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

