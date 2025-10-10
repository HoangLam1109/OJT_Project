import { CardTitle, CardDescription } from '../common/card';
import { Shield } from 'lucide-react';

export function LoginHeader() {
  return (
    <>
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
      </div>

      <CardTitle className="text-2xl text-gray-900 mb-2 leading-tight">
        Hệ Thống Quản Lý Thông Tin <br />
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Phòng Thí Nghiệm
        </span>
      </CardTitle>
      <CardDescription className="text-sm text-gray-600 max-w-sm mx-auto">
        Đăng nhập để truy cập hệ thống
      </CardDescription>
    </>
  );
}
