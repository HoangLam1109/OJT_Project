export interface Sample {
  id: string;
  type: string;
  receivedDate: string;
  status: string;
}

// Interface matching ServiceTestPage Sample structure
export interface TestOrderSample {
  id: string;
  barcode: string;
  patientId: string;
  patientName: string;
  testType: string;
  priority: 'urgent' | 'normal' | 'routine';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  assignedInstrument?: string;
  startTime?: string;
  estimatedCompletion?: string;
}

export interface TestOrder {
  id: string;
  barcode?: string; // Mã vạch/mã mẫu (tương tự ServiceTestPage)
  patientName: string;
  patientId: string;
  testType: string;
  testName?: string;
  createdAt: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled' | 'pending' | 'processing' | 'completed' | 'failed';
  priority: 'Normal' | 'Urgent' | 'Emergency' | 'urgent' | 'normal' | 'routine';
  assignedTo?: string;
  assignedInstrument?: string; // Thiết bị được gán để xử lý (như ServiceTestPage)
  progress?: number; // Tiến độ xét nghiệm (%)
  startTime?: string; // Thời gian bắt đầu xử lý
  estimatedCompletion?: string; // Thời gian dự kiến hoàn thành
  notes?: string;
  createdBy: string;
  collectionDate?: string;
  sampleType?: string;
  samples?: Sample[];
}

export interface TestResult {
  id?: string;
  testOrderId: string;
  resultValue: string;
  unit?: string;
  referenceRange?: string;
  comment?: string;
  attachments?: string[];
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

