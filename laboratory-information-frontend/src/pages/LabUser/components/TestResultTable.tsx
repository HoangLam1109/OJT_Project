import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../components/common/table';
import { Eye, FlaskConical, Printer } from 'lucide-react';
import TestResultStatusBadge from './TestResultStatusBadge';
import type { TestResult } from '../types/TestResultTypes';

interface TestResultTableProps {
  results: TestResult[];
  onViewResult: (result: TestResult) => void;
  onReviewResult: (result: TestResult) => void;
  onExportPDF: (result: TestResult) => void;
}

const TestResultTable: React.FC<TestResultTableProps> = ({ 
  results, 
  onViewResult, 
  onReviewResult, 
  onExportPDF 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Mã
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Bệnh nhân
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Loại XN
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ngày hoàn thành
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Trạng thái
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Thao tác
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((result) => (
          <TableRow key={result.id}>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {result.id}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>
                <div className="font-medium">{result.patientName}</div>
                <div className="text-gray-500">{result.patientId}</div>
              </div>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>
                <div className="font-medium">{result.testType}</div>
                <div className="text-gray-500">{result.testName}</div>
              </div>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {result.completedAt}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <TestResultStatusBadge status={result.status} />
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-2">
                <button
                  onClick={() => onViewResult(result)}
                  className="text-blue-600 hover:text-blue-900"
                  title="Xem kết quả"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {result.status === 'Completed' && (
                  <button
                    onClick={() => onReviewResult(result)}
                    className="text-green-600 hover:text-green-900"
                    title="Review kết quả"
                  >
                    <FlaskConical className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onExportPDF(result)}
                  className="text-purple-600 hover:text-purple-900"
                  title="In / Xuất PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TestResultTable;

