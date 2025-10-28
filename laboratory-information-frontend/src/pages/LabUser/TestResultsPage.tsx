import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/card';
import Button from '../../components/common/button';
import { Input } from '../../components/common/input';
import { Label } from '../../components/common/label';
import { toast } from 'sonner';
import {
  Search,
  FlaskConical,
  X,
  Activity
} from 'lucide-react';

// Import types
import type { TestResult } from './types/TestResultTypes';

// Import API
import { testResultsAPI } from './data/mockTestResultsData';

// Import components
import TestResultTable from './components/TestResultTable';
import TestResultDetailModal from './components/modals/TestResultDetailModal';


// Simplified ReviewResultModal (keeping inline for now)
const ReviewResultModal: React.FC<{
  result: TestResult | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, resultData: Partial<TestResult>) => void;
}> = ({ result, isOpen, onClose, onSubmit }) => {
  if (!isOpen || !result) return null;

  const [resultData, setResultData] = useState({
        result: result.result || '',
        notes: result.notes || ''
      });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(result.id, resultData);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Review kết quả xét nghiệm</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="result" className="text-sm font-medium">
                Kết quả
                </Label>
                <Input
                  id="result"
                  value={resultData.result}
                onChange={(e) => setResultData(prev => ({ ...prev, result: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium">
                Ghi chú
              </Label>
              <textarea
                id="notes"
                value={resultData.notes}
                onChange={(e) => setResultData(prev => ({ ...prev, notes: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit">
                <FlaskConical className="w-4 h-4 mr-2" />
                Gửi để duyệt
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main Component
const TestResultsPage: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadTestResults();
  }, []);

  // Filter results when search or status changes
  useEffect(() => {
    let filtered = results;

    if (searchTerm) {
      filtered = filtered.filter(result =>
        result.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.testName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(result => result.status === statusFilter);
    }

    setFilteredResults(filtered);
  }, [results, searchTerm, statusFilter]);

  const loadTestResults = async () => {
    try {
      setLoading(true);
      const data = await testResultsAPI.fetchTestResults();
      setResults(data);
    } catch (error) {
      toast.error('Không thể tải danh sách kết quả xét nghiệm');
      console.error('Error loading test results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResult = (result: TestResult) => {
    setSelectedResult(result);
    setDetailModalOpen(true);
  };

  const handleReviewResult = (result: TestResult) => {
    setSelectedResult(result);
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (id: string, resultData: Partial<TestResult>) => {
    try {
      await testResultsAPI.updateTestResult(id, resultData);
      toast.success('Đã gửi kết quả để duyệt thành công');
      setReviewModalOpen(false);
      loadTestResults();
    } catch (error) {
      toast.error('Không thể gửi kết quả để duyệt');
      console.error('Error reviewing result:', error);
    }
  };

  const handleExportPDF = async (result: TestResult) => {
    try {
      await testResultsAPI.exportToPDF(result.id);
      toast.success(`Đã xuất PDF cho test order ${result.id}`);
    } catch (error) {
      toast.error('Không thể xuất PDF');
      console.error('Error exporting PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Kết quả Xét nghiệm</h1>
          <p className="text-gray-600">Nhập và quản lý kết quả xét nghiệm đã hoàn thành</p>
        </div>
        <div className="flex items-center space-x-2">
          <FlaskConical className="w-8 h-8 text-green-600" />
          <span className="text-sm text-gray-500">
            {filteredResults.length} / {results.length} kết quả xét nghiệm
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                Tìm kiếm
              </Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Tìm theo mã, tên bệnh nhân, loại xét nghiệm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="md:w-48">
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                Trạng thái
              </Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="All">Tất cả</option>
                <option value="Completed">Hoàn thành</option>
                <option value="Reviewed">Đã duyệt</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={loadTestResults} className="flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FlaskConical className="w-5 h-5 mr-2" />
            Danh sách Kết quả Xét nghiệm
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <FlaskConical className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có kết quả xét nghiệm</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'All' 
                  ? 'Không tìm thấy kết quả xét nghiệm phù hợp với bộ lọc'
                  : 'Chưa có kết quả xét nghiệm nào'
                }
              </p>
            </div>
          ) : (
            <TestResultTable
              results={filteredResults}
              onViewResult={handleViewResult}
              onReviewResult={handleReviewResult}
              onExportPDF={handleExportPDF}
            />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <TestResultDetailModal
        result={selectedResult}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />

      <ReviewResultModal
        result={selectedResult}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default TestResultsPage;
