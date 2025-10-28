export interface TestResult {
  id: string;
  patientName: string;
  patientId: string;
  testType: string;
  testName: string;
  completedAt: string;
  status: 'Completed' | 'Reviewed';
  result: string;
  unit?: string;
  referenceRange?: string;
  attachments?: string[];
  notes?: string;
  comments?: Comment[];
  updatedAt?: string;
  updatedBy?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

