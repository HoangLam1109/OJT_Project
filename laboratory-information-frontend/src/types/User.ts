export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'SERVICE' | 'LAB_USER' | 'USER' ;
  active: boolean;
  lastLogin?: string;
  permissions: string[];
  phone_number?: string;
  identify_number?: string;
  gender?: string;
  age?: number;
  address?: string;
  date_of_birth?: string;
  schedule?: {
    startTime: string;
    endTime: string;
    workDays: string[];
  };
}

export type SafeUser = Omit<User, 'email' | 'phone_number' | 'identify_number' | 'address'>;