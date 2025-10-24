import { apiService } from './apiClient';
import type { ManagerUser, UserFormData } from '../pages/manager/types/ManagerTypes';

// Backend user interface (from API response)
interface BackendUser {
  _id: string;
  email: string;
  fullName: string;
  identityNumber: string;
  gender: string;
  age: number;
  dateOfBirth: string;
  phoneNumber?: string;
  address?: string;
  isActive: boolean;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

// Transform backend user to frontend user format
const transformBackendUser = (backendUser: BackendUser): ManagerUser => {
  return {
    id: backendUser._id || '',
    name: backendUser.fullName || 'N/A',
    email: backendUser.email || 'N/A',
    role: (backendUser.role as ManagerUser['role']) || 'USER',
    active: backendUser.isActive ?? true,
    lastLogin: new Date().toISOString(), // Backend doesn't provide this yet
    permissions: [], // Backend doesn't provide this yet
    phone_number: backendUser.phoneNumber || '',
    identify_number: backendUser.identityNumber || '',
    gender: (backendUser.gender as 'male' | 'female' | 'other') || 'male',
    age: backendUser.age || 0,
    address: backendUser.address || '',
    date_of_birth: backendUser.dateOfBirth || '',
    createdAt: backendUser.createdAt || '',
    updatedAt: backendUser.updatedAt || '',
  };
};

// Transform frontend user to backend format
const transformFrontendUser = (frontendUser: UserFormData) => {
  return {
    email: frontendUser.email,
    fullName: frontendUser.fullName,
    identityNumber: frontendUser.identify_number,
    gender: frontendUser.gender,
    age: frontendUser.age || 0,
    dateOfBirth: new Date(frontendUser.date_of_birth),
    phoneNumber: frontendUser.phone_number,
    address: frontendUser.address,
    isActive: frontendUser.active,
    role: frontendUser.role,
    ...(frontendUser.password && { password: frontendUser.password }),
  };
};

export class UserService {
  // Get all users
  async getAllUsers(): Promise<ManagerUser[]> {
    try {
      const response = await apiService.get<BackendUser[]>('/user/all');
      return response.map(transformBackendUser);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Không thể tải danh sách người dùng');
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<ManagerUser> {
    try {
      const response = await apiService.get<BackendUser>(`/user/${userId}`);
      return transformBackendUser(response);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Không thể tải thông tin người dùng');
    }
  }

  // Get current user's profile
  async getMyProfile(): Promise<ManagerUser> {
    try {
      const response = await apiService.get<BackendUser>('/user/profile');
      return transformBackendUser(response);
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new Error('Không thể tải hồ sơ người dùng');
    }
  }

  // Create user
  async createUser(userData: UserFormData): Promise<ManagerUser> {
    try {
      const backendData = transformFrontendUser(userData);
      const response = await apiService.post<BackendUser>('/user/create', backendData);
      return transformBackendUser(response);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Không thể tạo người dùng');
    }
  }

  // Update user
  async updateUser(userId: string, userData: UserFormData): Promise<ManagerUser> {
    try {
      const backendData = transformFrontendUser(userData);
      const response = await apiService.put<BackendUser>(`/user/update/${userId}`, backendData);
      return transformBackendUser(response);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Không thể cập nhật người dùng');
    }
  }

  // Delete user
  async deleteUser(userId: string): Promise<boolean> {
    try {
      await apiService.delete(`/user/delete/${userId}`);
      return true;
    } catch (error: unknown) {
      console.error('Error deleting user:', error);
      // Check if it's a 404 error (user not found)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          throw new Error('Người dùng không tồn tại');
        }
      }
      throw new Error('Không thể xóa người dùng');
    }
  }

  // Toggle user active status (lock/unlock)
  async toggleUserStatus(userId: string, isActive: boolean): Promise<ManagerUser> {
    try {
      const userData: UserFormData = {
        fullName: '', // Will be filled by backend
        email: '', // Will be filled by backend
        role: 'USER', // Will be filled by backend
        phone_number: '',
        identify_number: '',
        gender: 'male',
        date_of_birth: '',
        address: '',
        active: isActive,
      };
      
      const backendData = transformFrontendUser(userData);
      const response = await apiService.put<BackendUser>(`/user/update/${userId}`, backendData);
      return transformBackendUser(response);
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw new Error('Không thể thay đổi trạng thái người dùng');
    }
  }
}

// Export singleton instance
export const userService = new UserService();
