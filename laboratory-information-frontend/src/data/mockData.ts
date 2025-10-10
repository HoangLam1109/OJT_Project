import type { User } from '../types';

export interface MockUser extends User {
  password: string;
  schedule?: {
    startTime: string;
    endTime: string;
    workDays: string[];
  };
}

// Shared mock user database  
export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'TS. Sarah - Quản trị viên',
    email: 'admin@lab.com',
    password: 'admin123',
    role: 'admin',
    active: true,
    permissions: ['all']
  },
  {
    id: '2',
    name: 'BS. Michael - Trưởng phòng Lab',
    email: 'manager@lab.com',
    password: 'manager123',
    role: 'laboratory_manager',
    active: true,
    permissions: ['manage_lab', 'view_reports'],
    schedule: {
      startTime: '07:00',
      endTime: '18:00',
      workDays: ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu']
    }
  },
  {
    id: '3',
    name: 'Anh John - Kỹ thuật viên Bảo trì',
    email: 'service@lab.com',
    password: 'service123',
    role: 'service',
    active: true,
    permissions: ['manage_service', 'view_inventory'],
    schedule: {
      startTime: '08:00',
      endTime: '17:00',
      workDays: ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
    }
  },
  {
    id: '4',
    name: 'Chị Lisa - Nhân viên Lab',
    email: 'labuser@lab.com',
    password: 'labuser123',
    role: 'lab_user',
    active: true,
    permissions: ['perform_tests', 'view_samples'],
    schedule: {
      startTime: '08:00',
      endTime: '17:00',
      workDays: ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu']
    }
  },
  {
    id: '5',
    name: 'Chị Jane - Bệnh nhân',
    email: 'user@example.com',
    password: 'user123',
    role: 'normal_user',
    active: true,
    permissions: ['view_results']
  },
  {
    id: '6',
    name: 'BS. David - Kỹ thuật viên',
    email: 'technician@lab.com',
    password: 'tech123',
    role: 'technician',
    active: true,
    permissions: ['perform_tests', 'update_results'],
    schedule: {
      startTime: '08:00',
      endTime: '17:00',
      workDays: ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu']
    }
  }
];

// Function to update user password
export const updateUserPassword = (userId: string, newPassword: string): boolean => {
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    mockUsers[userIndex].password = newPassword;
    return true;
  }
  return false;
};

// Function to find user by email
export const findUserByEmail = (email: string): MockUser | undefined => {
  return mockUsers.find(user => user.email === email);
};

// Function to authenticate user
export const authenticateUser = (email: string, password: string): MockUser | null => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  return user || null;
};