import axios from 'axios';
import type { TestResultApiResponse, TestResultGroup, TestResult, TestResultDetail } from '../pages/LabUser/types/TestResultTypes';

const TEST_RESULT_API_BASE = 'http://localhost:5002/api';

// Create axios instance for test result service
const testResultClient = axios.create({
  baseURL: TEST_RESULT_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transform API response to UI format
const transformTestResultGroup = (group: TestResultGroup): TestResult => {
  console.log('Transforming group:', group);
  const results: TestResultDetail[] = group.resultsSample.map(item => {
    console.log('Mapping item:', item);
    console.log('Item _id:', item._id);
    return {
      id: item._id,
      testItemId: item.test_item_id,
      test_type: item.test_type,
      name: item.name,
      code: item.code,
      unit: item.unit,
      resultValue: item.result_value,
      resultStatus: item.result_status,
      reviewed: item.reviewed,
      reviewerComment: item.reviewer_comment,
      createdAt: item.createdAt,
    };
  });

  const reviewedCount = results.filter(r => r.reviewed).length;
  const pendingCount = results.filter(r => !r.reviewed).length;

  return {
    testOrderId: group.resultsSample[0]?.test_order_id || '',
    patientName: group.patient_name,
    test_type: group.test_type,
    totalTests: group.totalResults,
    results,
    reviewedCount,
    pendingCount,
    createdAt: group.resultsSample[0]?.createdAt || new Date().toISOString(),
  };
};

export class TestResultService {
  async getAllTestResults(): Promise<TestResult[]> {
    try {
      // Tải tất cả dữ liệu và phân trang ở frontend
      const response = await testResultClient.get<TestResultApiResponse>('/testResult/all', {
        params: { page: 1, limit: 1000 }
      });

      const results = response.data.data.map(transformTestResultGroup);
      
      // Sắp xếp theo createdAt từ mới nhất đến cũ nhất
      return results.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Mới nhất trước
      });
    } catch (error) {
      console.error('Error fetching test results:', error);
      throw new Error('Không thể tải danh sách kết quả xét nghiệm');
    }
  }

  async updateTestResult(
    id: string,
    updateData: { result_value?: number; reviewer_comment?: string; reviewed?: boolean }
  ): Promise<void> {
    try {
      await testResultClient.put(`/testResult/update/${id}`, updateData);
    } catch (error) {
      console.error('Error updating test result:', error);
      throw new Error('Không thể cập nhật kết quả xét nghiệm');
    }
  }

  async reviewTestResult(id: string, comment: string): Promise<void> {
    try {
      await testResultClient.put(`/testResult/update/${id}`, {
        reviewed: true,
        reviewer_comment: comment,
      });
    } catch (error) {
      console.error('Error reviewing test result:', error);
      throw new Error('Không thể duyệt kết quả xét nghiệm');
    }
  }

  async deleteTestResult(test_order_id: string): Promise<void> {
    try {
      await testResultClient.delete(`/testResult/delete/${test_order_id}`);
    } catch (error) {
      console.error('Error deleting test result:', error);
      throw new Error('Không thể xóa kết quả xét nghiệm');
    }
  }
}

export const testResultService = new TestResultService();