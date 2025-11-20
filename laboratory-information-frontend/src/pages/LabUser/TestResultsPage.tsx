import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/card';
import Button from '../../components/common/button';
import { Input } from '../../components/common/input';
import { Label } from '../../components/common/label';
import { Textarea } from '../../components/common/textarea';
import Pagination from '../../components/common/pagination';
import { toast } from 'sonner';
import {
  Search,
  FlaskConical,
  X,
  Activity,
  ChevronDown,
  Edit,
  Trash2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  onUpdateSuccess: () => void;
}> = ({ result, patientName, isOpen, onClose, onUpdateSuccess }) => {
  const { t } = useTranslation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [resultValue, setResultValue] = useState<number>(0);
  const [reviewerComment, setReviewerComment] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Initialize form values when result changes
  useEffect(() => {
    if (result) {
      console.log('Modal opened with result:', result);
      console.log('Result ID:', result.id);
      setResultValue(result.resultValue);
      setReviewerComment(result.reviewerComment || '');
    }
  }, [result]);

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

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      console.log('Updating test result with ID:', result.id);
      console.log('Update data:', { result_value: resultValue, reviewer_comment: reviewerComment });
      await testResultService.updateTestResult(result.id, {
        result_value: resultValue,
        reviewer_comment: reviewerComment,
      });
      toast.success(t('testResult.updateSuccess'));
      setIsEditMode(false);
      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating test result:', error);
      toast.error(t('testResult.updateFailed'));
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setResultValue(result.resultValue);
    setReviewerComment(result.reviewerComment || '');
    setIsEditMode(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await testResultService.deleteTestResult(result.id);
      toast.success(t('testResult.deleteSuccess'));
      setShowDeleteConfirm(false);
      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting test result:', error);
      toast.error(t('testResult.deleteFailed'));
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {isEditMode ? t('testResult.modal.editTitle') : t('testResult.modal.detailTitle')}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{t('testResult.modal.patient')}</p>
                  <p className="font-medium">{patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('testResult.modal.testType')}</p>
                  <p className="font-medium">{result.test_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('testResult.modal.testItem')}</p>
                  <p className="font-medium">{result.name} ({result.code})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('testResult.modal.result')}</p>
                  {isEditMode ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={resultValue}
                        onChange={(e) => setResultValue(parseFloat(e.target.value))}
                        className="w-32"
                      />
                      <span className="font-medium text-gray-700">{result.unit}</span>
                    </div>
                  ) : (
                    <p className="font-medium">{result.resultValue} {result.unit}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('testResult.modal.status')}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${result.resultStatus === 'normal' ? 'bg-green-100 text-green-800' :
                    result.resultStatus === 'abnormal' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {result.resultStatus === 'normal' ? t('testResult.status.normal') :
                      result.resultStatus === 'abnormal' ? t('testResult.status.abnormal') : t('testResult.status.critical')}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('testResult.modal.createdAt')}</p>
                  <p className="font-medium">{formatDateTime(result.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">{t('testResult.modal.reviewerComment')}</p>
              {isEditMode ? (
                <Textarea
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  placeholder={t('testResult.modal.commentPlaceholder')}
                  rows={4}
                  className="w-full"
                />
              ) : (
                <>
                  {result.reviewerComment ? (
                    <p className="text-gray-800">{result.reviewerComment}</p>
                  ) : (
                    <p className="text-gray-400 italic">{t('testResult.modal.noComment')}</p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            {isEditMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updating}
                >
                  {t('testResult.cancel')}
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {updating ? t('testResult.updating') : t('testResult.update')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('testResult.delete')}
                </Button>
                <Button
                  onClick={() => setIsEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t('testResult.update')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('testResult.deleteConfirm.title')}</h3>
            <p className="text-gray-600 mb-6">
              {t('testResult.deleteConfirm.description', { testName: result?.name, patientName: patientName })}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={cancelDelete}
                disabled={deleting}
              >
                {t('testResult.cancel')}
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleting ? t('testResult.deleting') : t('testResult.delete')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
const TestResultsPage: React.FC = () => {
  const { t } = useTranslation();
  const [allResults, setAllResults] = useState<TestResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResult, setSelectedResult] = useState<{
    result: TestResultDetail;
    patientName: string;
  } | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadTestResults = useCallback(async () => {
    try {
      setLoading(true);
      const data = await testResultService.getAllTestResults();
      setAllResults(data);
    } catch (error) {
      toast.error(t('testResult.cannotLoadResults'));
      console.error('Error loading test results:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadTestResults();
  }, [loadTestResults]);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter results when search changes
  useEffect(() => {
    let filtered = allResults;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(result =>
        result.patientName.toLowerCase().includes(searchLower) ||
        result.testOrderId.toLowerCase().includes(searchLower)
      );
    }

    setFilteredResults(filtered);
  }, [allResults, searchTerm]);

  const totalPages = useMemo(() => {
    if (filteredResults.length === 0) return 1;
    return Math.ceil(filteredResults.length / itemsPerPage);
  }, [filteredResults.length, itemsPerPage]);

  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredResults.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredResults, currentPage, itemsPerPage]);

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
          <h1 className="text-2xl font-semibold text-gray-900">{t('testResult.title')}</h1>
          <p className="text-gray-600">{t('testResult.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <FlaskConical className="w-8 h-8 text-green-600" />
          <span className="text-sm text-gray-500">
            {t('testResult.resultsCount', { current: filteredResults.length, total: allResults.length })}
            {searchTerm && ` ${t('testResult.foundResults', { found: filteredResults.length, total: allResults.length })}`}
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                {t('testResult.search')}
              </Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  type="text"
                  placeholder={t('testResult.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={loadTestResults} className="flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                {t('testResult.refresh')}
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
            {t('testResult.resultsList')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {paginatedResults.length === 0 ? (
            <div className="text-center py-12">
              <FlaskConical className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('testResult.noResults')}</h3>
              <p className="text-gray-500">
                {searchTerm
                  ? t('testResult.noResultsSearch')
                  : t('testResult.noResultsEmpty')
                }
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 p-4">
                {paginatedResults.map((result) => {
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
                          <div className="flex justify-between items-center">
                            {/* Left content (2 dòng) */}
                            <div>
                              <h3 className="text-base font-semibold text-gray-900">
                                {t('testResult.patientName')}: {result.patientName}
                              </h3>
                              <h3 className="text-sm font-medium text-gray-700 mt-1">
                                {t('testResult.testType')}: {result.test_type}
                              </h3>
                            </div>

                            <ChevronDown
                              className={`w-5 h-5 transition-all duration-300 ${isExpanded
                                ? 'transform rotate-180 text-blue-500'
                                : 'text-gray-400'
                                }`}
                            />
                          </div>
                          <div className="mt-2 flex items-center gap-6 text-sm text-gray-600">
                            <span>{t('testResult.totalTests')}: <span className="font-medium text-gray-900">{result.totalTests}</span></span>
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
                            <h4 className="font-semibold text-sm text-gray-700 mb-3">{t('testResult.testDetails')}:</h4>
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
                                      {t('testResult.result')}: <span className="font-bold text-gray-900">{detail.resultValue} {detail.unit}</span>
                                    </p>
                                    {detail.reviewerComment && (
                                      <p className="text-xs text-gray-500 mt-2 italic bg-blue-50 p-2 rounded">{t('testResult.comment')}: {detail.reviewerComment}</p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 ml-4">
                                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap ${detail.resultStatus === 'normal' ? 'bg-green-100 text-green-700 border border-green-200' :
                                      detail.resultStatus === 'abnormal' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                        'bg-red-100 text-red-700 border border-red-200'
                                      }`}>
                                      {detail.resultStatus === 'normal' ? t('testResult.status.normal') :
                                        detail.resultStatus === 'abnormal' ? t('testResult.status.abnormal') : t('testResult.status.critical')}
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
              {totalPages > 1 && (
                <div className="flex justify-center p-4 border-t border-gray-200">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
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
          onUpdateSuccess={loadTestResults}
        />
      )}
    </div>
  );
};

export default TestResultsPage;
