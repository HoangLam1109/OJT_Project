import { CardTitle, CardDescription } from '../../../components/common/card';
import { Shield } from 'lucide-react';

export function RegisterHeader() {
	return (
		<>
			<div className="flex justify-center mb-3">
				<div className="relative">
					<div className="p-4 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl shadow-lg">
						<Shield className="h-7 w-7 text-white" />
					</div>
					<div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
				</div>
			</div>

			<CardTitle className="text-2xl text-gray-900 mb-1 leading-tight">
				Đăng Ký Tài Khoản <br />
				<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
					Phòng Thí Nghiệm
				</span>
			</CardTitle>
			<CardDescription className="text-sm text-gray-600 max-w-sm mx-auto">
				Tạo tài khoản mới để sử dụng hệ thống
			</CardDescription>
		</>
	);
}


