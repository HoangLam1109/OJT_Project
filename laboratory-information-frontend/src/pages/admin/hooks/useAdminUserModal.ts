import { useState } from 'react';
import type { AdminUser, AdminModalState } from '../types/AdminTypes';

export function useAdminUserModal() {
  const [modalState, setModalState] = useState<AdminModalState>({
    isOpen: false,
    mode: 'view',
    user: null,
  });

  const openCreateModal = () => {
    setModalState({
      isOpen: true,
      mode: 'create',
      user: null,
    });
  };

  const openViewModal = (user: AdminUser) => {
    setModalState({
      isOpen: true,
      mode: 'view',
      user,
    });
  };

  const openEditModal = (user: AdminUser) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      user,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: 'view',
      user: null,
    });
  };

  return {
    modalState,
    openCreateModal,
    openViewModal,
    openEditModal,
    closeModal,
  };
}

