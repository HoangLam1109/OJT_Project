import type { TestOrder } from '../types/TestOrderTypes';

export const mockPatients = [
  { id: "P001", fullName: "Nguyễn Văn A" },
  { id: "P002", fullName: "Trần Thị B" },
  { id: "P003", fullName: "Lê Văn C" },
  { id: "P004", fullName: "Phạm Thị D" },
  { id: "P005", fullName: "Hoàng Văn E" }
];

export const mockTestTypes = [
  "Sinh hóa máu",
  "Huyết học tổng quát", 
  "Vi sinh",
  "Miễn dịch",
  "Nội tiết",
  "Ung thư học"
];

export const mockSampleTypes = [
  "Máu tĩnh mạch",
  "Máu mao mạch", 
  "Máu động mạch",
  "Huyết thanh",
  "Nước tiểu",
  "Dịch não tủy"
];

export const initialTestOrders: TestOrder[] = [
  {
    id: "TO-2025-001",
    patientName: "Nguyễn Văn A",
    patientId: "P001",
    testType: "Sinh hóa máu",
    testName: "Đường huyết",
    createdAt: "2025-01-20",
    status: "Pending",
    priority: "Normal",
    assignedTo: "Lab User 1",
    notes: "Nhịn ăn 8h",
    createdBy: "Lab User 1",
    collectionDate: "2025-01-20",
    sampleType: "Máu tĩnh mạch",
    samples: [
      { id: "S001", type: "Máu tĩnh mạch", receivedDate: "2025-01-20", status: "Received" }
    ]
  },
  {
    id: "TO-2025-002",
    patientName: "Trần Thị B",
    patientId: "P002",
    testType: "Huyết học tổng quát",
    testName: "Tổng phân tích tế bào máu",
    createdAt: "2025-01-21",
    status: "Processing",
    priority: "Urgent",
    assignedTo: "Lab User 2",
    notes: "Mẫu máu tĩnh mạch",
    createdBy: "Lab User 2",
    collectionDate: "2025-01-21",
    sampleType: "Máu mao mạch",
    samples: [
      { id: "S002", type: "Máu mao mạch", receivedDate: "2025-01-21", status: "Processing" }
    ]
  },
  {
    id: "TO-2025-003",
    patientName: "Lê Văn C",
    patientId: "P003",
    testType: "Vi sinh",
    testName: "Cấy máu",
    createdAt: "2025-01-19",
    status: "Completed",
    priority: "Emergency",
    assignedTo: "Lab User 1",
    notes: "Sốt cao, nghi ngờ nhiễm trùng",
    createdBy: "Lab User 1",
    collectionDate: "2025-01-19",
    sampleType: "Máu động mạch",
    samples: [
      { id: "S003", type: "Máu động mạch", receivedDate: "2025-01-19", status: "Completed" }
    ]
  },
  {
    id: "TO-2025-004",
    patientName: "Phạm Thị D",
    patientId: "P004",
    testType: "Miễn dịch",
    testName: "Anti-HCV",
    createdAt: "2025-01-18",
    status: "Cancelled",
    priority: "Normal",
    assignedTo: "Lab sécurité",
    notes: "Kiểm tra định kỳ",
    createdBy: "Lab User 3",
    collectionDate: "2025-01-18",
    sampleType: "Huyết thanh",
    samples: [
      { id: "S004", type: "Huyết thanh", receivedDate: "2025-01-18", status: "Cancelled" }
    ]
  }
];

// In-memory storage for dynamic data
export let dynamicTestOrders: TestOrder[] = [...initialTestOrders];

export const testOrdersAPI = {
  fetchTestOrders: async (): Promise<TestOrder[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return dynamicTestOrders;
  },

  createTestOrder: async (orderData: Omit<TestOrder, 'id' | 'createdAt' | 'createdBy'>): Promise<{ success: boolean; id: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingIds = dynamicTestOrders.map(o => parseInt(o.id.split('-')[2]));
    const maxId = Math.max(...existingIds, 0);
    const newId = `TO-2025-${String(maxId + 1).padStart(3, '0')}`;
    
    const newOrder: TestOrder = {
      ...orderData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Lab User',
      samples: orderData.samples || []
    };
    
    dynamicTestOrders.push(newOrder);
    
    console.log(`[AUDIT] E_00016 | Test Order created by Lab User`, orderData);
    console.log(`[AUDIT] New test order added:`, newOrder);
    
    return { success: true, id: newId };
  },

  updateTestOrder: async (id: string, orderData: Partial<TestOrder>): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const orderIndex = dynamicTestOrders.findIndex(o => o.id === id);
    if (orderIndex !== -1) {
      dynamicTestOrders[orderIndex] = {
        ...dynamicTestOrders[orderIndex],
        ...orderData
      };
    }
    
    console.log(`[AUDIT] E_00017 | Test Order updated by Lab User`, { id, orderData });
    return { success: true };
  },

  deleteTestOrder: async (id: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const orderIndex = dynamicTestOrders.findIndex(o => o.id === id);
    if (orderIndex !== -1) {
      dynamicTestOrders.splice(orderIndex, 1);
    }
    
    console.log(`[AUDIT] E_00018 | Test Order deleted by Lab User`, { id });
    return { success: true };
  },

  updateTestResult: async (testOrderId: string, result: any): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updating test result:', { testOrderId, result });
    return { success: true };
  },

  addComment: async (testOrderId: string, comment: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Adding comment:', { testOrderId, comment });
    return { success: true };
  }
};

