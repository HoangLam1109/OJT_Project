export interface Reagent {
  id: string;
  name: string;
  lotNumber: string;
  manufacturer?: string;
  receivedDate: string;
  expiryDate: string;
  quantity: number;
  status: "Available" | "Low Stock" | "Expired" | "Depleted";
  storageLocation: string;
  usedInTests: string[];
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const mockReagents: Reagent[] = [
  {
    id: "RG-001",
    name: "Huyết thanh xét nghiệm HBV",
    lotNumber: "HBV2025A",
    manufacturer: "BioPharma Co.",
    receivedDate: "2025-01-05",
    expiryDate: "2026-01-05",
    quantity: 25,
    status: "Available",
    storageLocation: "Tủ lạnh 2°C",
    usedInTests: ["HBV-1002", "HBV-1003"],
    notes: "Thuốc thử chất lượng cao, bảo quản tốt",
    createdBy: "lab_user_01",
    createdAt: "2025-01-05T08:30:00Z",
    updatedAt: "2025-10-21T14:30:00Z"
  },
  {
    id: "RG-002",
    name: "Dung dịch kiểm tra Glucose",
    lotNumber: "GLC-9921",
    manufacturer: "LabTech",
    receivedDate: "2024-11-01",
    expiryDate: "2025-11-15",
    quantity: 5,
    status: "Low Stock",
    storageLocation: "Ngăn lạnh 4°C",
    usedInTests: ["GLC-2001", "GLC-2002"],
    notes: "Cần đặt hàng bổ sung",
    createdBy: "lab_user_02",
    createdAt: "2024-11-01T10:15:00Z",
    updatedAt: "2025-10-20T16:45:00Z"
  },
  {
    id: "RG-003",
    name: "Thuốc thử Cholesterol",
    lotNumber: "CHOL-2024B",
    manufacturer: "MediLab Solutions",
    receivedDate: "2024-08-15",
    expiryDate: "2025-08-15",
    quantity: 0,
    status: "Expired",
    storageLocation: "Kho lạnh -20°C",
    usedInTests: ["CHOL-3001"],
    notes: "Đã hết hạn, cần xử lý",
    createdBy: "lab_user_01",
    createdAt: "2024-08-15T09:20:00Z",
    updatedAt: "2025-08-15T12:00:00Z"
  },
  {
    id: "RG-004",
    name: "Dung dịch chuẩn Creatinine",
    lotNumber: "CREA-2025C",
    manufacturer: "StandardLab",
    receivedDate: "2025-02-10",
    expiryDate: "2026-02-10",
    quantity: 15,
    status: "Available",
    storageLocation: "Tủ lạnh 2°C",
    usedInTests: ["CREA-4001", "CREA-4002", "CREA-4003"],
    notes: "Đang sử dụng cho các xét nghiệm chức năng thận",
    createdBy: "lab_user_02",
    createdAt: "2025-02-10T11:30:00Z",
    updatedAt: "2025-10-21T09:15:00Z"
  },
  {
    id: "RG-005",
    name: "Thuốc thử Protein tổng",
    lotNumber: "PROT-2025D",
    manufacturer: "BioChem Inc.",
    receivedDate: "2025-03-20",
    expiryDate: "2026-03-20",
    quantity: 8,
    status: "Low Stock",
    storageLocation: "Tủ lạnh 4°C",
    usedInTests: ["PROT-5001"],
    notes: "Sắp hết, cần đặt hàng",
    createdBy: "lab_user_01",
    createdAt: "2025-03-20T14:45:00Z",
    updatedAt: "2025-10-19T13:20:00Z"
  },
  {
    id: "RG-006",
    name: "Dung dịch kiểm tra ALT",
    lotNumber: "ALT-2025E",
    manufacturer: "EnzymeLab",
    receivedDate: "2025-04-05",
    expiryDate: "2026-04-05",
    quantity: 20,
    status: "Available",
    storageLocation: "Tủ lạnh 2°C",
    usedInTests: ["ALT-6001", "ALT-6002"],
    notes: "Thuốc thử mới, chất lượng tốt",
    createdBy: "lab_user_02",
    createdAt: "2025-04-05T16:10:00Z",
    updatedAt: "2025-10-20T11:30:00Z"
  },
  {
    id: "RG-007",
    name: "Thuốc thử Bilirubin",
    lotNumber: "BILI-2024F",
    manufacturer: "HepatoLab",
    receivedDate: "2024-12-01",
    expiryDate: "2025-12-01",
    quantity: 3,
    status: "Low Stock",
    storageLocation: "Tủ lạnh 4°C",
    usedInTests: ["BILI-7001"],
    notes: "Sắp hết hạn và sắp hết số lượng",
    createdBy: "lab_user_01",
    createdAt: "2024-12-01T08:45:00Z",
    updatedAt: "2025-10-18T15:20:00Z"
  },
  {
    id: "RG-008",
    name: "Dung dịch chuẩn Urea",
    lotNumber: "UREA-2025G",
    manufacturer: "RenalTech",
    receivedDate: "2025-05-15",
    expiryDate: "2026-05-15",
    quantity: 12,
    status: "Available",
    storageLocation: "Tủ lạnh 2°C",
    usedInTests: ["UREA-8001", "UREA-8002"],
    notes: "Thuốc thử ổn định, hiệu quả cao",
    createdBy: "lab_user_02",
    createdAt: "2025-05-15T12:30:00Z",
    updatedAt: "2025-10-21T10:45:00Z"
  }
];

export const mockTestOrders = [
  { id: "HBV-1002", patientName: "Nguyễn Văn A", testType: "Xét nghiệm HBV" },
  { id: "HBV-1003", patientName: "Trần Thị B", testType: "Xét nghiệm HBV" },
  { id: "GLC-2001", patientName: "Lê Văn C", testType: "Đường huyết" },
  { id: "GLC-2002", patientName: "Phạm Thị D", testType: "Đường huyết" },
  { id: "CHOL-3001", patientName: "Hoàng Văn E", testType: "Cholesterol" },
  { id: "CREA-4001", patientName: "Vũ Thị F", testType: "Creatinine" },
  { id: "CREA-4002", patientName: "Đặng Văn G", testType: "Creatinine" },
  { id: "CREA-4003", patientName: "Bùi Thị H", testType: "Creatinine" },
  { id: "PROT-5001", patientName: "Ngô Văn I", testType: "Protein tổng" },
  { id: "ALT-6001", patientName: "Đinh Thị K", testType: "ALT" },
  { id: "ALT-6002", patientName: "Lý Văn L", testType: "ALT" },
  { id: "BILI-7001", patientName: "Mai Thị M", testType: "Bilirubin" },
  { id: "UREA-8001", patientName: "Tôn Văn N", testType: "Urea" },
  { id: "UREA-8002", patientName: "Hồ Thị O", testType: "Urea" }
];

export const mockAuditLogs = [
  {
    id: "AUD-RG-001",
    reagentId: "RG-001",
    action: "Created",
    performedBy: "lab_user_01",
    timestamp: "2025-01-05T08:30:00Z",
    details: "Reagent HBV serum created successfully"
  },
  {
    id: "AUD-RG-002",
    reagentId: "RG-001",
    action: "Modified",
    performedBy: "lab_user_01",
    timestamp: "2025-10-21T14:30:00Z",
    details: "Updated quantity and usage information"
  },
  {
    id: "AUD-RG-003",
    reagentId: "RG-002",
    action: "Created",
    performedBy: "lab_user_02",
    timestamp: "2024-11-01T10:15:00Z",
    details: "Glucose test solution added to inventory"
  },
  {
    id: "AUD-RG-004",
    reagentId: "RG-002",
    action: "Modified",
    performedBy: "lab_user_02",
    timestamp: "2025-10-20T16:45:00Z",
    details: "Status changed to Low Stock due to quantity"
  },
  {
    id: "AUD-RG-005",
    reagentId: "RG-003",
    action: "Expired",
    performedBy: "system",
    timestamp: "2025-08-15T12:00:00Z",
    details: "Cholesterol reagent expired automatically"
  },
  {
    id: "AUD-RG-006",
    reagentId: "RG-004",
    action: "Created",
    performedBy: "lab_user_02",
    timestamp: "2025-02-10T11:30:00Z",
    details: "Creatinine standard solution added"
  },
  {
    id: "AUD-RG-007",
    reagentId: "RG-004",
    action: "Modified",
    performedBy: "lab_user_02",
    timestamp: "2025-10-21T09:15:00Z",
    details: "Status changed to Available"
  }
];
