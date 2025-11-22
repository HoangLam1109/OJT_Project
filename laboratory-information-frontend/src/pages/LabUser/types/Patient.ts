export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phoneNumber: string;
  email?: string;
  address?: string;
  medicalHistory?: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}
