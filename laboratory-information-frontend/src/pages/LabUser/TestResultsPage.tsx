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
  Activity,
  ChevronDown
} from 'lucide-react';

// Import types
import type { TestResult, TestResultDetail } from './types/TestResultTypes';

// Import API
import { testResultService } from '../../service/testResultService';

// Import components
import { Skeleton } from '@/components/common/skeleton';


// View Detail Modal Component
const ViewDetailModal: React.FC<{
  result: TestResultDetail | null;
  patientName: string;
  isOpen: boolean;
  onClose: () => void;
}> = ({ result, patientName, isOpen, onClose }) => {
  if (!isOpen || !result) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Chi tiết kết quả xét nghiệm</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Bệnh nhân</p>
                  <p className="font-medium">{patientName}</p>
                </div>
                 <div>
                  <p className="text-sm text-gray-600">Chủ đề xét nghiệm</p>
                  <p className="font-medium">{result.test_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Loại xét nghiệm</p>
                  <p className="font-medium">{result.name} ({result.code})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kết quả</p>
                  <p className="font-medium">{result.resultValue} {result.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${result.resultStatus === 'normal' ? 'bg-green-100 text-green-800' :
                      result.resultStatus === 'abnormal' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {result.resultStatus === 'normal' ? 'Bình thường' :
                      result.resultStatus === 'abnormal' ? 'Bất thường' : 'Nghiêm trọng'}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Thời gian tạo</p>
                  <p className="font-medium">{formatDateTime(result.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Nhận xét của người đánh giá</p>
              {result.reviewerComment ? (
                <p className="text-gray-800">{result.reviewerComment}</p>
              ) : (
                <p className="text-gray-400 italic">Chưa có nhận xét</p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={onClose}>
              Đóng
            </Button>
          </div>
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
  const [selectedResult, setSelectedResult] = useState<{ result: TestResultDetail; patientName: string } | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Load data on mount
  useEffect(() => {
    loadTestResults();
  }, []);

  // Filter results when search changes
  useEffect(() => {
    let filtered = results;

    if (searchTerm) {
      filtered = filtered.filter(result =>
        result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.testOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.results.some(r =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.code.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredResults(filtered);
  }, [results, searchTerm]);

  const loadTestResults = async () => {
    try {
      setLoading(true);
      const data = await testResultService.getAllTestResults();
      setResults(data);
    } catch (error) {
      toast.error('Không thể tải danh sách kết quả xét nghiệm');
      console.error('Error loading test results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (result: TestResultDetail, patientName: string) => {
    setSelectedResult({ result, patientName });
    setViewModalOpen(true);
  };

  const toggleRow = (testOrderId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testOrderId)) {
        newSet.delete(testOrderId);
      } else {
        newSet.add(testOrderId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        {/* Filter section skeleton */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-1/5" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 p-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          </CardContent>
        </Card>
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
                {searchTerm
                  ? 'Không tìm thấy kết quả xét nghiệm phù hợp với từ khóa tìm kiếm'
                  : 'Chưa có kết quả xét nghiệm nào'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredResults.map((result) => {
                const isExpanded = expandedRows.has(result.testOrderId);
                return (
                  <div
                    key={result.testOrderId}
                    className={`border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${isExpanded ? 'bg-blue-50 border-blue-200' : 'bg-white'
                      }`}
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => toggleRow(result.testOrderId)}
                    >
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-gray-900">
                            Patient name: {result.patientName}
                          </h3>

                          <h3 className="text-base font-semibold text-gray-900">
                            Test type: {result.test_type}
                          </h3>

                          <ChevronDown
                            className={`w-5 h-5 transition-all duration-300 ${isExpanded
                                ? 'transform rotate-180 text-blue-500'
                                : 'text-gray-400'
                              }`}
                          />
                        </div>
                        <div className="mt-2 flex items-center gap-6 text-sm text-gray-600">
                          <span>Tổng số xét nghiệm: <span className="font-medium text-gray-900">{result.totalTests}</span></span>
                          <span className="text-gray-400">|</span>
                          <span>
                            {new Date(result.createdAt).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                      <div className="px-6 py-4 bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-gray-700 mb-3">Chi tiết xét nghiệm:</h4>
                          <div className="grid grid-cols-1 gap-3">
                            {result.results.map((detail, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetail(detail, result.patientName);
                                }}
                              >
                                <div className="flex-1">
                                  <p className="font-semibold text-sm text-gray-800 mb-1">{detail.name} ({detail.code})</p>
                                  <p className="text-sm text-gray-600">
                                    Kết quả: <span className="font-bold text-gray-900">{detail.resultValue} {detail.unit}</span>
                                  </p>
                                  {detail.reviewerComment && (
                                    <p className="text-xs text-gray-500 mt-2 italic bg-blue-50 p-2 rounded">Nhận xét: {detail.reviewerComment}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap ${detail.resultStatus === 'normal' ? 'bg-green-100 text-green-700 border border-green-200' :
                                      detail.resultStatus === 'abnormal' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                        'bg-red-100 text-red-700 border border-red-200'
                                    }`}>
                                    {detail.resultStatus === 'normal' ? 'Bình thường' :
                                      detail.resultStatus === 'abnormal' ? 'Bất thường' : 'Nghiêm trọng'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedResult && (
        <ViewDetailModal
          result={selectedResult.result}
          patientName={selectedResult.patientName}
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TestResultsPage;
