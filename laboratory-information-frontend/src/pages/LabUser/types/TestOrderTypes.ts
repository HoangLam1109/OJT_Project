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
  patient_id: string;
  patient_name: string;
  testType: string;
  status: 'Pending' | 'processing' | 'Completed' ;
  progress?: number;
  startTime?: string;
  processing?:number;
}

export interface TestOrder {
  id: string;
  barcode?: string;
  patient_id: string;
  testType: string;
  patient_name: string
  status: 'Pending' | 'Processing' | 'Completed'  ;
  progress?: number; 
  created_at?:string;
  created_by?:string;
  due_date?: string; 
  updated_at?:string;
  updated_by?:string;
  is_deleted?:boolean;
  deleted_at?:string;
  deleted_by?:string;
  notes?: string;
  processing?:number;
  assignedInstrument?:string
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

