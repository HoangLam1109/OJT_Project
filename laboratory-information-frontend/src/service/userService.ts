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
  // Format date of birth for HTML input type="date" (YYYY-MM-DD format)
  let formattedDateOfBirth = '';
  if (backendUser.dateOfBirth) {
    try {
      const date = new Date(backendUser.dateOfBirth);
      if (!isNaN(date.getTime())) {
        formattedDateOfBirth = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
      }
    } catch (error) {
      console.warn('Error formatting date of birth:', error);
    }
  }

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
    gender: (() => {
      const gender = backendUser.gender;
      if (gender === 'male' || gender === 'Male') return 'Male';
      if (gender === 'female' || gender === 'Female') return 'Female';
      if (gender === 'other' || gender === 'Other') return 'Other';
      return 'Male'; // default fallback
    })(),
    age: backendUser.age || 0,
    address: backendUser.address || '',
    date_of_birth: formattedDateOfBirth,
    createdAt: backendUser.createdAt || '',
    updatedAt: backendUser.updatedAt || '',
  };
};

// Transform frontend user to backend format
const transformFrontendUser = (frontendUser: UserFormData) => {
  // Calculate age from date of birth if not provided or if age is 0
  let calculatedAge = frontendUser.age;
  if (!calculatedAge || calculatedAge <= 0) {
    const today = new Date();
    const birthDate = new Date(frontendUser.date_of_birth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    calculatedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age;
    // Ensure minimum age of 1
    calculatedAge = Math.max(calculatedAge, 1);
  }

  const backendData = {
    email: frontendUser.email,
    fullName: frontendUser.fullName,
    identityNumber: frontendUser.identify_number,
    gender: frontendUser.gender, // This should already be 'Male', 'Female', or 'Other' from frontend
    age: calculatedAge,
    dateOfBirth: new Date(frontendUser.date_of_birth),
    phoneNumber: frontendUser.phone_number,
    address: frontendUser.address,
    // isActive: frontendUser.active, // Temporarily commented out - API doesn't accept this field for user creation
    role: frontendUser.role,
    ...(frontendUser.password && { password: frontendUser.password }),
  };

  console.log('Frontend user data:', frontendUser);
  console.log('Backend data being sent:', backendData);
  
  return backendData;
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
      console.log('Creating user with data:', userData);
      const backendData = transformFrontendUser(userData);
      console.log('Sending to API:', backendData);
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
        gender: 'Male' as 'Male' | 'Female' | 'Other',
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
