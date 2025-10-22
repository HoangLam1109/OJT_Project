import { AlertTriangle, User } from 'lucide-react';
import Button from '../../../components/common/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/common/card';
import type { AdminUser } from '../types/AdminTypes';

interface AdminDeleteConfirmDialogProps {
  user: AdminUser;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminDeleteConfirmDialog({ user, onConfirm, onCancel }: AdminDeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-gray-600/40 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-lg text-gray-900">Xác nhận xóa người dùng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Xóa người dùng
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

