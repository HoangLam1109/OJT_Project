import { CardTitle, CardDescription } from '../../components/common/card';
import { TestTube } from 'lucide-react';

export function RegisterHeader() {
	return (
		<>
			<div className="flex justify-center mb-4">
				<div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
					<TestTube className="w-8 h-8 text-white" />
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


