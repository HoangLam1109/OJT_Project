
import type { FooterActionsProps } from './types/register';

export function FooterActions({ onBackToLogin, onBackToHome }: FooterActionsProps) {
	return (
		<div className="text-center space-y-1">
			<p className="text-sm text-gray-600">
				Đã có tài khoản?{' '}
				<button className="text-blue-600 hover:underline" onClick={onBackToLogin}>Đăng nhập ngay</button>
			</p>
			{onBackToHome && (
				<div>
					<button type="button" className="text-sm text-gray-700 hover:text-gray-900 hover:underline" onClick={onBackToHome}>
						← Quay lại trang chủ
					</button>
				</div>
			)}
		</div>
	);
}
