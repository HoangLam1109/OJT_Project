import type { User as UserType } from '../../../types/User';
import React from 'react';

export interface AdminLayoutProps {
  children: React.ReactNode;
  currentUser: UserType;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}



export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  testHistory: Test[];
}

export interface Test {
  id: string;
  patientId: string;
  testType: string;
  orderDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'validated' | 'ai_reviewed';
  sampleId?: string;
  results?: string;
  fee: number;
  technician?: string;
  completionDate?: string;
  aiReviewData?: {
    reviewedAt: string;
    reviewScore: number;
    confidence: number;
    flags: string[];
    recommendations: string[];
    anomalies: Array<{
      parameter: string;
      value: number;
      expected: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>;
  };
}

export interface Chemical {
  id: string;
  name: string;
  batchCode: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  minStockLevel: number;
  costPerUnit: number;
  supplier: string;
  testTypes: string[];
  quantityPerTest: number;
}

export interface Bill {
  id: string;
  patientId: string;
  tests: string[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'overdue';
  paymentMethod?: string;
  paymentDate?: string;
  dueDate: string;
}


