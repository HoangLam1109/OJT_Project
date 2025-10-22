import React, { useState } from 'react';
import { Card, CardContent } from '../../components/common/card';
import { Input } from '../../components/common/input';
import Button from '../../components/common/button';
import { Search, Download, ClipboardList } from 'lucide-react';
import { mockTestResults } from './data/mockTest';

const TestResults: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResults = mockTestResults.filter(
    (test) =>
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">
          Kết quả xét nghiệm & Lịch sử
        </h1>
        <p className="text-sm text-gray-500">Xem và tải xuống kết quả xét nghiệm của bạn</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Tìm kiếm kết quả xét nghiệm..."
          className="pl-10 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredResults.map((test) => (
          <Card key={test.id} className="bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-4 flex-grow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">{test.name}</h3>
                      <span className="text-sm text-gray-500">Mã xét nghiệm: {test.id}</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        test.status === 'hoàn thành'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {test.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Ngày đặt</p>
                      <p className="font-medium text-gray-900">{test.orderDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">
                        {test.completionDate ? 'Ngày hoàn thành' : 'Dự kiến hoàn thành'}
                      </p>
                      <p className="font-medium text-gray-900">
                        {test.completionDate || test.dueDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Chi phí</p>
                      <p className="font-medium text-gray-900">{test.cost}</p>
                    </div>
                  </div>

                  {test.testResult && (
                    <>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <ClipboardList className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-900 mb-1">
                              Kết quả xét nghiệm
                            </h4>
                            <p className="text-green-800 text-sm">{test.testResult}</p>
                          </div>
                        </div>
                      </div>
                      {test.status === 'hoàn thành' && (
                        <div className="flex justify-end mt-3">
                          <Button variant="download" size="sm" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Tải xuống báo cáo
                          </Button>
                        </div>
                      )}
                    </>
                  )}

                  {test.status === 'đang xử lý' && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <svg
                          className="h-5 w-5 text-blue-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <circle cx="12" cy="12" r="10" strokeWidth="2" />
                          <path
                            d="M12 8v4M12 16h.01"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        <p className="text-blue-800 text-sm">
                          Xét nghiệm của bạn đang được xử lý. Kết quả sẽ có sẵn sớm.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {searchQuery && filteredResults.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy kết quả xét nghiệm nào phù hợp với "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResults;
