import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { AdminUser, AdminUserFormData } from '../types/AdminTypes';
import { mockAdminUsers } from '../data/mockUsers';

export function useAdminUserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load users from mock data
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      setUsers([...mockAdminUsers]);
      toast.success('Tải danh sách người dùng thành công');
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create user
  const createUser = useCallback(async (data: AdminUserFormData): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser: AdminUser = {
        id: `usr${Date.now()}`,
        name: data.fullName,
        email: data.email,
        role: data.role,
        active: data.active,
        lastLogin: new Date().toISOString(),
        permissions: [],
        phone_number: data.phone_number,
        identify_number: data.identify_number,
        gender: data.gender,
        age: data.age,
        address: data.address,
        date_of_birth: data.date_of_birth,
      };
      
      mockAdminUsers.push(newUser);
      await loadUsers();
      toast.success('Tạo người dùng thành công');
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Có lỗi xảy ra khi tạo người dùng');
      return false;
    }
  }, [loadUsers]);

  // Update user
  const updateUser = useCallback(async (userId: string, data: AdminUserFormData): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = mockAdminUsers.findIndex(u => u.id === userId);
      if (index !== -1) {
        mockAdminUsers[index] = {
          ...mockAdminUsers[index],
          name: data.fullName,
          role: data.role,
          phone_number: data.phone_number,
          identify_number: data.identify_number,
          gender: data.gender,
          age: data.age,
          address: data.address,
          date_of_birth: data.date_of_birth,
          active: data.active,
        };
      }
      
      await loadUsers();
      toast.success('Cập nhật người dùng thành công');
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Có lỗi xảy ra khi cập nhật người dùng');
      return false;
    }
  }, [loadUsers]);

  // Delete user
  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = mockAdminUsers.findIndex(u => u.id === userId);
      if (index !== -1) {
        mockAdminUsers.splice(index, 1);
      }
      
      await loadUsers();
      toast.success('Xóa người dùng thành công');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Có lỗi xảy ra khi xóa người dùng');
      return false;
    }
  }, [loadUsers]);

  // Toggle user lock
  const toggleUserLock = useCallback(async (userId: string, currentStatus: boolean): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = mockAdminUsers.findIndex(u => u.id === userId);
      if (index !== -1) {
        mockAdminUsers[index].active = !mockAdminUsers[index].active;
      }
      
      await loadUsers();
      toast.success(currentStatus ? 'Khóa tài khoản thành công' : 'Mở khóa tài khoản thành công');
      return true;
    } catch (error) {
      console.error('Error toggling lock:', error);
      toast.error('Có lỗi xảy ra khi thực hiện thao tác');
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

