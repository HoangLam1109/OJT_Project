import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import type { ManagerUser, UserFormData } from '../types/ManagerTypes';
import { userService } from '../../../service/userService';
import { apiUtils } from '../../../service/apiClient';

export function useUserManagement() {
  const [users, setUsers] = useState<ManagerUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasLoadedRef = useRef(false);

  // Load users from API
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
      if (!hasLoadedRef.current) {
        toast.success('Tải danh sách người dùng thành công');
        hasLoadedRef.current = true;
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create user
  const createUser = useCallback(async (data: UserFormData): Promise<boolean> => {
    try {
      await userService.createUser(data);
      await loadUsers();
      toast.success('Tạo người dùng thành công');
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      // Lấy message từ backend response
      const errorMessage = apiUtils.getErrorMessage(error);
      toast.error(errorMessage);
      return false;
    }
  }, [loadUsers]);

  // Update user
  const updateUser = useCallback(async (userId: string, data: UserFormData): Promise<boolean> => {
    try {
      await userService.updateUser(userId, data);
      await loadUsers();
      toast.success('Cập nhật người dùng thành công');
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      // Lấy message từ backend response
      const errorMessage = apiUtils.getErrorMessage(error);
      toast.error(errorMessage);
      return false;
    }
  }, [loadUsers]);

  // Delete user
  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      await userService.deleteUser(userId);
      await loadUsers();
      toast.success('Xóa người dùng thành công');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      // Lấy message từ backend response
      const errorMessage = apiUtils.getErrorMessage(error);
      toast.error(errorMessage);
      return false;
    }
  }, [loadUsers]);

  // Toggle user lock
  const toggleUserLock = useCallback(async (userId: string, currentStatus: boolean): Promise<boolean> => {
    try {
      await userService.toggleUserStatus(userId, !currentStatus);
      await loadUsers();
      toast.success(currentStatus ? 'Khóa tài khoản thành công' : 'Mở khóa tài khoản thành công');
      return true;
    } catch (error) {
      console.error('Error toggling lock:', error);
      // Lấy message từ backend response
      const errorMessage = apiUtils.getErrorMessage(error);
      toast.error(errorMessage);
      return false;
    }
  }, [loadUsers]);

  // Load on mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users,
    isLoading,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserLock,
  };
}

