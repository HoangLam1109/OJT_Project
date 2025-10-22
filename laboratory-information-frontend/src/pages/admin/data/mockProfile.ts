import type { User } from '../../../types/User';

export interface AdminProfile extends User {
  department: string;
  position: string;
  employeeId: string;
  hireDate: string;
  workSchedule: {
    startTime: string;
    endTime: string;
    workDays: string[];
  };
  contactInfo: {
    personalEmail?: string;
    personalPhone?: string;
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginHistory: LoginHistory[];
  };
}

export interface LoginHistory {
  id: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  status: 'success' | 'failed';
}

export const mockAdminProfile: AdminProfile = {
  id: 'usr001',
  name: 'TS. Sarah Wilson',
  email: 'sarah.wilson@lab.com',
  role: 'ADMIN',
  active: true,
  lastLogin: '2024-10-21T09:30:00Z',
  permissions: ['all'],
  phone_number: '+84-901-234-567',
  identify_number: '079089001234',
  gender: 'female',
  age: 35,
  address: '123 Đường Láng, Đống Đa, Hà Nội',
  date_of_birth: '1989-03-15',
  department: 'Quản lý Hệ thống',
  position: 'Trưởng phòng IT',
  employeeId: 'EMP-001',
  hireDate: '2020-01-15',
  workSchedule: {
    startTime: '08:00',
    endTime: '17:00',
    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  contactInfo: {
    personalEmail: 'sarah.wilson.personal@gmail.com',
    personalPhone: '+84-901-234-567',
    emergencyContact: {
      name: 'John Wilson',
      phone: '+84-902-345-678',
      relationship: 'Chồng'
    }
  },
  preferences: {
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  },
  security: {
    twoFactorEnabled: true,
    lastPasswordChange: '2024-09-15T10:30:00Z',
    loginHistory: [
      {
        id: 'login001',
        timestamp: '2024-10-21T09:30:00Z',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Hà Nội, Việt Nam',
        status: 'success'
      },
      {
        id: 'login002',
        timestamp: '2024-10-20T08:15:00Z',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Hà Nội, Việt Nam',
        status: 'success'
      },
      {
        id: 'login003',
        timestamp: '2024-10-19T14:20:00Z',
        ipAddress: '192.168.1.200',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        location: 'TP. Hồ Chí Minh, Việt Nam',
        status: 'success'
      },
      {
        id: 'login004',
        timestamp: '2024-10-18T16:45:00Z',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'Hà Nội, Việt Nam',
        status: 'failed'
      }
    ]
  }
};
