


export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'laboratory_manager' | 'service' | 'lab_user' | 'normal_user' | 'technician';
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