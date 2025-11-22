import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/card';
import { Settings, Save, RefreshCw } from 'lucide-react';
import Button from '../../components/common/button';

export function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-gray-600 mt-1">Cấu hình và quản lý cài đặt hệ thống</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="h-4 w-4 mr-2" />
            Lưu cài đặt
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Khôi phục mặc định
          </Button>
        </div>
      </div>

      {/* Coming Soon Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <span>Cài đặt hệ thống</span>
          </CardTitle>
          <CardDescription>
            Tính năng đang được phát triển
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tính năng đang phát triển
            </h3>
            <p className="text-gray-500 mb-6">
              Trang cài đặt hệ thống sẽ sớm được hoàn thiện với đầy đủ các tính năng:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="text-left p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Cài đặt bảo mật</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Cấu hình JWT</li>
                  <li>• Chính sách mật khẩu</li>
                  <li>• Session timeout</li>
                </ul>
              </div>
              <div className="text-left p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Cài đặt hệ thống</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Cấu hình database</li>
                  <li>• Thông báo</li>
                  <li>• Backup & Restore</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

