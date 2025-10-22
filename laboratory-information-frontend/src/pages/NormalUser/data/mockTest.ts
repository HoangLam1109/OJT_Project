export interface TestResult {
  id: string;
  name: string;
  orderDate: string;
  completionDate?: string;
  dueDate?: string;
  status: 'hoàn thành' | 'đang xử lý';
  cost: string;
  testResult?: string;
}

export const mockTestResults: TestResult[] = [
  {
    id: 'T001',
    name: 'Sinh hóa máu',
    orderDate: '2024-09-10',
    completionDate: '2024-09-12',
    status: 'hoàn thành',
    cost: '150.000 VNĐ',
    testResult:
      'Glucose bình thường. Tất cả các chỉ số đều nằm trong phạm vi bình thường.',
  },
  {
    id: 'T004',
    name: 'Chức năng tuyến giáp',
    orderDate: '2024-09-15',
    completionDate: '2024-09-15',
    status: 'hoàn thành',
    cost: '200.000 VNĐ',
    testResult:
      'TSH: 2.5 mUI/L (Bình thường). T4: 7.8 µg/dL (Bình thường). Tất cả các chỉ số giáp đều bình thường.',
  },
  {
    id: 'T006',
    name: 'Công thức máu toàn phần',
    orderDate: '2024-09-16',
    dueDate: '2024-09-17',
    status: 'đang xử lý',
    cost: '85.000 VNĐ',
  },
];
