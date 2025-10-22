export interface TestOrder {
  id: string;
  patientId: string;
  patientName: string;
  orderNumber: string;
  testType: string;
  testCategory: 'hematology' | 'chemistry' | 'microbiology' | 'immunology' | 'pathology';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'routine' | 'urgent' | 'stat';
  orderedBy: string;
  orderedDate: string;
  expectedDate?: string;
  completedDate?: string;
  results?: TestResult[];
  notes?: string;
  cost: number;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'cancelled';
}

export interface TestResult {
  id: string;
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'abnormal' | 'critical';
  flag?: string;
  performedBy: string;
  performedDate: string;
  verifiedBy?: string;
  verifiedDate?: string;
}

export const mockTestOrders: TestOrder[] = [
  {
    id: 'ord001',
    patientId: 'pat001',
    patientName: 'Nguyễn Văn An',
    orderNumber: 'ORD-2024-001',
    testType: 'CBC (Complete Blood Count)',
    testCategory: 'hematology',
    status: 'completed',
    priority: 'routine',
    orderedBy: 'Dr. Sarah Wilson',
    orderedDate: '2024-10-20T08:30:00Z',
    expectedDate: '2024-10-20T16:00:00Z',
    completedDate: '2024-10-20T15:45:00Z',
    results: [
      {
        id: 'res001',
        testName: 'White Blood Cell Count',
        value: '7.2',
        unit: '10³/μL',
        referenceRange: '4.0-11.0',
        status: 'normal',
        performedBy: 'CN. Lisa Chen',
        performedDate: '2024-10-20T15:30:00Z',
        verifiedBy: 'Dr. Sarah Wilson',
        verifiedDate: '2024-10-20T15:45:00Z'
      },
      {
        id: 'res002',
        testName: 'Hemoglobin',
        value: '14.5',
        unit: 'g/dL',
        referenceRange: '12.0-16.0',
        status: 'normal',
        performedBy: 'CN. Lisa Chen',
        performedDate: '2024-10-20T15:30:00Z',
        verifiedBy: 'Dr. Sarah Wilson',
        verifiedDate: '2024-10-20T15:45:00Z'
      }
    ],
    notes: 'Patient fasting for 12 hours',
    cost: 150000,
    paymentStatus: 'paid'
  },
  {
    id: 'ord002',
    patientId: 'pat002',
    patientName: 'Trần Thị Cường',
    orderNumber: 'ORD-2024-002',
    testType: 'Basic Metabolic Panel',
    testCategory: 'chemistry',
    status: 'in_progress',
    priority: 'urgent',
    orderedBy: 'Dr. David Kim',
    orderedDate: '2024-10-21T09:15:00Z',
    expectedDate: '2024-10-21T14:00:00Z',
    results: [
      {
        id: 'res003',
        testName: 'Glucose',
        value: '95',
        unit: 'mg/dL',
        referenceRange: '70-100',
        status: 'normal',
        performedBy: 'CN. Mike Johnson',
        performedDate: '2024-10-21T11:30:00Z'
      }
    ],
    notes: 'Patient has diabetes history',
    cost: 200000,
    paymentStatus: 'pending'
  },
  {
    id: 'ord003',
    patientId: 'pat003',
    patientName: 'Lê Văn Em',
    orderNumber: 'ORD-2024-003',
    testType: 'Liver Function Test',
    testCategory: 'chemistry',
    status: 'pending',
    priority: 'routine',
    orderedBy: 'Dr. Sarah Wilson',
    orderedDate: '2024-10-21T10:00:00Z',
    expectedDate: '2024-10-21T16:00:00Z',
    notes: 'Monitor liver function for hepatitis B patient',
    cost: 180000,
    paymentStatus: 'pending'
  },
  {
    id: 'ord004',
    patientId: 'pat004',
    patientName: 'Phạm Thị Gia',
    orderNumber: 'ORD-2024-004',
    testType: 'Allergy Panel',
    testCategory: 'immunology',
    status: 'completed',
    priority: 'routine',
    orderedBy: 'Dr. David Kim',
    orderedDate: '2024-10-19T14:30:00Z',
    expectedDate: '2024-10-20T12:00:00Z',
    completedDate: '2024-10-20T11:45:00Z',
    results: [
      {
        id: 'res004',
        testName: 'Dust Mite IgE',
        value: '2.5',
        unit: 'kU/L',
        referenceRange: '<0.35',
        status: 'abnormal',
        flag: 'H',
        performedBy: 'CN. Lisa Chen',
        performedDate: '2024-10-20T11:30:00Z',
        verifiedBy: 'Dr. David Kim',
        verifiedDate: '2024-10-20T11:45:00Z'
      }
    ],
    notes: 'Patient reports dust allergy symptoms',
    cost: 300000,
    paymentStatus: 'paid'
  },
  {
    id: 'ord005',
    patientId: 'pat005',
    patientName: 'Hoàng Văn Ích',
    orderNumber: 'ORD-2024-005',
    testType: 'Urine Culture',
    testCategory: 'microbiology',
    status: 'cancelled',
    priority: 'routine',
    orderedBy: 'Dr. Sarah Wilson',
    orderedDate: '2024-10-18T16:00:00Z',
    notes: 'Patient cancelled appointment',
    cost: 120000,
    paymentStatus: 'cancelled'
  }
];
