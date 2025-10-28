import type { TestResult } from '../types/TestResultTypes';

export const initialTestResults: TestResult[] = [
  {
    id: "TO-2025-010",
    patientName: "Lê Văn C",
    patientId: "P010",
    testType: "Sinh hóa nước tiểu",
    testName: "Protein niệu",
    completedAt: "2025-01-21",
    status: "Completed",
    result: "",
    unit: "mg/dL",
    referenceRange: "< 30 mg/dL",
    notes: "Mẫu nước tiểu buổi sáng",
    comments: [],
    updatedAt: "2025-01-21",
    updatedBy: "Lab User 1"
  },
  {
    id: "TO-2025-011",
    patientName: "Phạm Thị D",
    patientId: "P011",
    testType: "Huyết học",
    testName: "Tổng phân tích tế bào máu",
    completedAt: "2025-01-21",
    status: "Reviewed",
    result: "Bình thường",
    unit: "",
    referenceRange: "",
    attachments: ["result_001.pdf"],
    notes: "Kết quả trong giới hạn bình thường",
    comments: [
      { id: "1", content: "Mẫu chất lượng tốt", createdAt: "2025-01-21", createdBy: "Lab User 1" },
      { id: "2", content: "Kết quả trong giới hạn bình thường", createdAt: "2025-01-21", createdBy: "Lab User 2" }
    ],
    updatedAt: "2025-01-21",
    updatedBy: "Lab User 2"
  },
  {
    id: "TO-2025-012",
    patientName: "Nguyễn Văn E",
    patientId: "P012",
    testType: "Vi sinh",
    testName: "Cấy máu",
    completedAt: "2025-01-20",
    status: "Completed",
    result: "",
    unit: "",
    referenceRange: "",
    notes: "Nghi ngờ nhiễm trùng",
    comments: [],
    updatedAt: "2025-01-20",
    updatedBy: "Lab User 1"
  },
  {
    id: "TO-2025-013",
    patientName: "Trần Thị F",
    patientId: "P013",
    testType: "Miễn dịch",
    testName: "Anti-HCV",
    completedAt: "2025-01-19",
    status: "Reviewed",
    result: "Âm tính",
    unit: "",
    referenceRange: "",
    attachments: ["result_002.pdf"],
    notes: "Không phát hiện kháng thể HCV",
    comments: [
      { id: "3", content: "Kết quả âm tính", createdAt: "2025-01-19", createdBy: "Lab User 3" }
    ],
    updatedAt: "2025-01-19",
    updatedBy: "Lab User 3"
  }
];

export let dynamicTestResults: TestResult[] = [...initialTestResults];

export const testResultsAPI = {
  fetchTestResults: async (): Promise<TestResult[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return dynamicTestResults;
  },

  updateTestResult: async (id: string, resultData: Partial<TestResult>): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updating test result:', { id, resultData });
    return { success: true };
  },

  addComment: async (testResultId: string, comment: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Adding comment:', { testResultId, comment });
    return { success: true };
  },

  deleteComment: async (commentId: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Deleting comment:', { commentId });
    return { success: true };
  },

  exportToPDF: async (id: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Exporting to PDF:', { id });
    return { success: true };
  }
};

