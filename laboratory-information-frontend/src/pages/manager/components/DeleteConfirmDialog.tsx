import { AlertTriangle, X } from 'lucide-react';
import Button from '../../../components/common/button';
import type { ManagerUser } from '../types/ManagerTypes';

interface DeleteConfirmDialogProps {
  user: ManagerUser;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({ user, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Xác nhận xóa người dùng
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {user.name}
                </div>
                <div className="text-sm text-gray-500">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Xóa người dùng
          </Button>
        </div>
      </div>
    </div>
  );
}

