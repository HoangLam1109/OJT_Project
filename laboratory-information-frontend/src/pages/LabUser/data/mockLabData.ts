export interface LabTest {
  id: string;
  patientName: string;
  patientId: string;
  testName: string;
  orderDate: string;
  dueDate: string;
  status: 'chờ xử lý' | 'đang thực hiện' | 'hoàn thành' | 'cần xác nhận';
  priority: 'thường' | 'khẩn cấp' | 'cấp cứu';
  assignedTo?: string;
  testType: string;
  sampleType: string;
  notes?: string;
  results?: LabResult[];
}

export interface LabResult {
  parameter: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'bình thường' | 'bất thường' | 'nghiêm trọng';
}

export const mockLabTests: LabTest[] = [
  {
    id: 'LT001',
    patientName: 'Nguyễn Văn A',
    patientId: 'P001',
    testName: 'Công thức máu toàn phần',
    orderDate: '2024-01-15',
    dueDate: '2024-01-15',
    status: 'chờ xử lý',
    priority: 'thường',
    testType: 'Hematology',
    sampleType: 'Máu tĩnh mạch',
    notes: 'Bệnh nhân nhịn ăn 8h'
  },
  {
    id: 'LT002',
    patientName: 'Trần Thị B',
    patientId: 'P002',
    testName: 'Sinh hóa máu',
    orderDate: '2024-01-15',
    dueDate: '2024-01-15',
    status: 'đang thực hiện',
    priority: 'khẩn cấp',
    assignedTo: 'Lab Tech A',
    testType: 'Chemistry',
    sampleType: 'Máu tĩnh mạch',
    notes: 'Bệnh nhân tiểu đường'
  },
  {
    id: 'LT003',
    patientName: 'Lê Văn C',
    patientId: 'P003',
    testName: 'Chức năng gan',
    orderDate: '2024-01-15',
    dueDate: '2024-01-15',
    status: 'hoàn thành',
    priority: 'thường',
    assignedTo: 'Lab Tech B',
    testType: 'Chemistry',
    sampleType: 'Máu tĩnh mạch',
    results: [
      {
        parameter: 'ALT',
        value: '45',
        unit: 'U/L',
        normalRange: '7-56',
        status: 'bình thường'
      },
      {
        parameter: 'AST',
        value: '38',
        unit: 'U/L',
        normalRange: '10-40',
        status: 'bình thường'
      },
      {
        parameter: 'Bilirubin Total',
        value: '1.2',
        unit: 'mg/dL',
        normalRange: '0.3-1.2',
        status: 'bình thường'
      }
    ]
  },
  {
    id: 'LT004',
    patientName: 'Phạm Thị D',
    patientId: 'P004',
    testName: 'Chức năng thận',
    orderDate: '2024-01-15',
    dueDate: '2024-01-15',
    status: 'cần xác nhận',
    priority: 'cấp cứu',
    assignedTo: 'Lab Tech C',
    testType: 'Chemistry',
    sampleType: 'Máu tĩnh mạch',
    notes: 'Bệnh nhân suy thận',
    results: [
      {
        parameter: 'Creatinine',
        value: '2.8',
        unit: 'mg/dL',
        normalRange: '0.6-1.2',
        status: 'nghiêm trọng'
      },
      {
        parameter: 'BUN',
        value: '45',
        unit: 'mg/dL',
        normalRange: '7-20',
        status: 'nghiêm trọng'
      }
    ]
  },
  {
    id: 'LT005',
    patientName: 'Hoàng Văn E',
    patientId: 'P005',
    testName: 'Đường huyết',
    orderDate: '2024-01-15',
    dueDate: '2024-01-15',
    status: 'chờ xử lý',
    priority: 'thường',
    testType: 'Chemistry',
    sampleType: 'Máu mao mạch',
    notes: 'Đo đường huyết ngẫu nhiên'
  }
];

export interface LabInstrument {
  id: string;
  name: string;
  type: string;
  status: 'hoạt động' | 'bảo trì' | 'lỗi';
  lastCalibration: string;
  nextCalibration: string;
  testsPerformed: number;
}

export const mockInstruments: LabInstrument[] = [
  {
    id: 'INS001',
    name: 'Hematology Analyzer BC-5000',
    type: 'Hematology',
    status: 'hoạt động',
    lastCalibration: '2024-01-10',
    nextCalibration: '2024-02-10',
    testsPerformed: 1250
  },
  {
    id: 'INS002',
    name: 'Chemistry Analyzer AU-680',
    type: 'Chemistry',
    status: 'hoạt động',
    lastCalibration: '2024-01-12',
    nextCalibration: '2024-02-12',
    testsPerformed: 2100
  },
  {
    id: 'INS003',
    name: 'Immunoassay Analyzer',
    type: 'Immunology',
    status: 'bảo trì',
    lastCalibration: '2024-01-08',
    nextCalibration: '2024-02-08',
    testsPerformed: 850
  }
];
