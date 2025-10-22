import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/card';
import { FileText, Download, Filter, Calendar } from 'lucide-react';
import Button from '../../components/common/button';

export function AdminAuditReportsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Kiểm toán</h1>
          <p className="text-gray-600 mt-1">Báo cáo hoạt động và nhật ký kiểm toán hệ thống</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
        </div>
      </div>

      {/* Coming Soon Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Báo cáo & Kiểm toán</span>
          </CardTitle>
          <CardDescription>
            Tính năng đang được phát triển
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tính năng đang phát triển
            </h3>
            <p className="text-gray-500 mb-6">
              Trang báo cáo & kiểm toán sẽ sớm được hoàn thiện với đầy đủ các tính năng:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="text-left p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Báo cáo hoạt động</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Báo cáo người dùng</li>
                  <li>• Báo cáo xét nghiệm</li>
                  <li>• Thống kê hệ thống</li>
                </ul>
              </div>
              <div className="text-left p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Nhật ký kiểm toán</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Lịch sử đăng nhập</li>
                  <li>• Thay đổi dữ liệu</li>
                  <li>• Hoạt động người dùng</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

