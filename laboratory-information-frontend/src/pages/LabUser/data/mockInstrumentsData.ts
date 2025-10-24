export interface Instrument {
  id: string;
  name: string;
  model: string;
  serial: string;
  status: "Active" | "Inactive" | "Maintenance";
  lastCalibrationDate: string;
  nextMaintenanceDate?: string;
  lastUsedDate?: string;
  assignedTests: string[];
  assignedTechnician?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const mockInstruments: Instrument[] = [
  {
    id: "INS-001",
    name: "Máy phân tích sinh hóa AU480",
    model: "Beckman AU480",
    serial: "BAU480-2024-01",
    status: "Active",
    lastCalibrationDate: "2025-09-01",
    nextMaintenanceDate: "2026-03-01",
    lastUsedDate: "2025-10-20",
    assignedTests: ["TST-1201", "TST-1202"],
    assignedTechnician: "Nguyễn Văn A",
    notes: "Thiết bị hoạt động tốt, cần kiểm tra định kỳ",
    createdBy: "lab_user_01",
    createdAt: "2025-01-15",
    updatedAt: "2025-10-21"
  },
  {
    id: "INS-002",
    name: "Máy đếm tế bào máu BC-5000",
    model: "Mindray BC-5000",
    serial: "MBC5000-2024-02",
    status: "Active",
    lastCalibrationDate: "2025-08-15",
    nextMaintenanceDate: "2026-02-15",
    lastUsedDate: "2025-10-19",
    assignedTests: ["TST-1203", "TST-1204"],
    assignedTechnician: "Trần Thị B",
    notes: "Cần thay thế kim tiêm định kỳ",
    createdBy: "lab_user_01",
    createdAt: "2025-02-10",
    updatedAt: "2025-10-20"
  },
  {
    id: "INS-003",
    name: "Máy đo đường huyết Accu-Chek",
    model: "Roche Accu-Chek",
    serial: "RAC2024-003",
    status: "Maintenance",
    lastCalibrationDate: "2025-07-20",
    nextMaintenanceDate: "2025-11-20",
    lastUsedDate: "2025-10-18",
    assignedTests: ["TST-1205"],
    assignedTechnician: "Lê Văn C",
    notes: "Đang bảo trì, dự kiến hoàn thành 25/10",
    createdBy: "lab_user_02",
    createdAt: "2025-03-05",
    updatedAt: "2025-10-18"
  },
  {
    id: "INS-004",
    name: "Máy phân tích điện giải ISE-900",
    model: "Siemens ISE-900",
    serial: "SISE900-2024-04",
    status: "Inactive",
    lastCalibrationDate: "2025-06-10",
    nextMaintenanceDate: "2025-12-10",
    lastUsedDate: "2025-10-15",
    assignedTests: ["TST-1206", "TST-1207"],
    assignedTechnician: "Phạm Thị D",
    notes: "Tạm ngưng hoạt động để nâng cấp phần mềm",
    createdBy: "lab_user_01",
    createdAt: "2025-04-12",
    updatedAt: "2025-10-15"
  },
  {
    id: "INS-005",
    name: "Máy đo cholesterol Cholestech",
    model: "Cholestech LDX",
    serial: "CLDX2024-005",
    status: "Active",
    lastCalibrationDate: "2025-09-15",
    nextMaintenanceDate: "2026-03-15",
    lastUsedDate: "2025-10-21",
    assignedTests: ["TST-1208"],
    assignedTechnician: "Hoàng Văn E",
    notes: "Thiết bị mới, hoạt động ổn định",
    createdBy: "lab_user_02",
    createdAt: "2025-05-20",
    updatedAt: "2025-10-21"
  }
];

export const mockTestOrders = [
  { id: "TST-1201", patientName: "Nguyễn Văn X", testType: "Sinh hóa máu" },
  { id: "TST-1202", patientName: "Trần Thị Y", testType: "Chức năng gan" },
  { id: "TST-1203", patientName: "Lê Văn Z", testType: "Tổng phân tích tế bào máu" },
  { id: "TST-1204", patientName: "Phạm Thị W", testType: "Đếm tế bào máu" },
  { id: "TST-1205", patientName: "Hoàng Văn V", testType: "Đường huyết" },
  { id: "TST-1206", patientName: "Vũ Thị U", testType: "Điện giải đồ" },
  { id: "TST-1207", patientName: "Đặng Văn T", testType: "Chức năng thận" },
  { id: "TST-1208", patientName: "Bùi Thị S", testType: "Cholesterol" }
];

export const mockAuditLogs = [
  {
    id: "AUD-001",
    instrumentId: "INS-001",
    action: "Created",
    performedBy: "lab_user_01",
    timestamp: "2025-01-15T08:30:00Z",
    details: "Instrument created successfully"
  },
  {
    id: "AUD-002",
    instrumentId: "INS-001",
    action: "Calibrated",
    performedBy: "lab_user_01",
    timestamp: "2025-09-01T10:15:00Z",
    details: "Annual calibration completed"
  },
  {
    id: "AUD-003",
    instrumentId: "INS-001",
    action: "Test Executed",
    performedBy: "lab_user_02",
    timestamp: "2025-10-20T14:30:00Z",
    details: "Blood test executed for TST-1201"
  }
];
