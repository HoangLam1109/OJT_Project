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
  const results: TestResultDetail[] = group.resultsSample.map(item => ({
    testItemId: item.test_item_id,
    name: item.name,
    code: item.code,
    unit: item.unit,
    resultValue: item.result_value,
    resultStatus: item.result_status,
    reviewed: item.reviewed,
    reviewerComment: item.reviewer_comment,
    createdAt: item.createdAt,
  }));

  const reviewedCount = results.filter(r => r.reviewed).length;
  const pendingCount = results.filter(r => !r.reviewed).length;

  return {
    testOrderId: group.resultsSample[0]?.test_order_id || '',
    patientName: group.patient_name,
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
      const response = await testResultClient.get<TestResultApiResponse>('/testResult/all');
      return response.data.data.map(transformTestResultGroup);
    } catch (error) {
      console.error('Error fetching test results:', error);
      throw new Error('Không thể tải danh sách kết quả xét nghiệm');
    }
  }

  async updateTestResult(
    testOrderId: string,
    testItemId: string,
    updateData: { result_value?: number; reviewer_comment?: string; reviewed?: boolean }
  ): Promise<void> {
    try {
      await testResultClient.put(`/testResult/update/${testOrderId}/${testItemId}`, updateData);
    } catch (error) {
      console.error('Error updating test result:', error);
      throw new Error('Không thể cập nhật kết quả xét nghiệm');
    }
  }

  async reviewTestResult(testOrderId: string, testItemId: string, comment: string): Promise<void> {
    try {
      await testResultClient.put(`/testResult/update/${testOrderId}/${testItemId}`, {
        reviewed: true,
        reviewer_comment: comment,
      });
    } catch (error) {
      console.error('Error reviewing test result:', error);
      throw new Error('Không thể duyệt kết quả xét nghiệm');
    }
  }
}

export const testResultService = new TestResultService();