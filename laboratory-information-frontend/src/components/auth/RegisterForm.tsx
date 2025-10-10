import React, { useState } from 'react';
import Button from '../common/button';
import { Alert, AlertDescription } from '../common/alert';
import { RegisterHeader } from './RegisterHeader';
import { RegisterInputField } from './RegisterInputField';

interface Props {
	onBackToLogin: () => void;
	onBackToHome?: () => void;
}

function isValidEmail(email: string) {
	return /.+@.+\..+/.test(email);
}

function isValidPhone(phone: string) {
	return /^\d{10,11}$/.test(phone);
}

function validatePassword(password: string) {
	if (password.length === 0) return '';
	if (password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
	if (password.length > 12) return 'Mật khẩu không được vượt quá 12 ký tự';
	if (!/[A-Z]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ hoa';
	if (!/[a-z]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ thường';
	if (!/\d/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ số';
	return '';
}

export function RegisterForm({ onBackToLogin, onBackToHome }: Props) {
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [phone, setPhone] = useState('');
	const [gender, setGender] = useState('');
	const [dob, setDob] = useState('');
	const [idNumber, setIdNumber] = useState('');
	const [address, setAddress] = useState('');
	const [error, setError] = useState('');
	const [passwordError, setPasswordError] = useState('');

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPassword = e.target.value;
		setPassword(newPassword);
		setPasswordError(validatePassword(newPassword));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!fullName || !email || !password || !confirmPassword) {
			setError('Vui lòng điền đầy đủ các thông tin bắt buộc');
			return;
		}
		if (!isValidEmail(email)) {
			setError('Địa chỉ email không hợp lệ');
			return;
		}
		if (passwordError) {
			setError(passwordError);
			return;
		}
		if (password !== confirmPassword) {
			setError('Mật khẩu xác nhận không khớp');
			return;
		}
		if (phone && !isValidPhone(phone)) {
			setError('Số điện thoại phải có 10-11 chữ số');
			return;
		}
		onBackToLogin();
		
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
			<div className="w-full max-w-2xl mx-auto px-4">
				<div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
					<div className="px-6 pt-6 pb-2 text-center">
						<RegisterHeader />
					</div>

					<div className="px-5 pb-4 space-y-2">
						<form onSubmit={handleSubmit} className="space-y-2">
							<RegisterInputField
								id="fullName"
								label="Họ và tên"
								placeholder="Nhập họ và tên đầy đủ..."
								value={fullName}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
								icon="user"
								required={true}
							/>

							<RegisterInputField
								id="email"
								label="Địa chỉ Email"
								type="email"
								placeholder="Nhập địa chỉ email..."
								value={email}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
								icon="mail"
								required={true}
							/>

							<RegisterInputField
								id="password"
								label="Mật khẩu"
								type="password"
								placeholder="Nhập mật khẩu (8-12 ký tự)..."
								value={password}
								onChange={handlePasswordChange}
								icon="lock"
								inputSize="sm"
								required={true}
							/>
							{passwordError && (
								<p className="text-xs text-red-500 -mt-1">{passwordError}</p>
							)}

							<RegisterInputField
								id="confirmPassword"
								label="Xác nhận mật khẩu"
								type="password"
								placeholder="Nhập lại mật khẩu..."
								value={confirmPassword}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
								icon="lock"
								inputSize="sm"
								required={true}
							/>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<RegisterInputField
									id="phone"
									label="Số điện thoại"
									placeholder="0xxxxxxxxx"
									value={phone}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
									icon="phone"
									required={false}
									inputSize="sm"
								/>
								<div className="space-y-2">
									<label className="text-sm text-gray-700">Giới tính</label>
									<select
										className={`h-10 w-full border border-gray-200 rounded-lg px-3 focus:outline-none focus:border-blue-400 bg-white ${gender ? 'text-gray-900' : 'text-gray-400'}`}
										value={gender}
										onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGender(e.target.value)}
									>
										<option value="" disabled>Chọn giới tính</option>
										<option className="text-gray-900" value="male">Nam</option>
										<option className="text-gray-900" value="female">Nữ</option>
										<option className="text-gray-900" value="other">Khác</option>
									</select>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<RegisterInputField
									id="dob"
									label="Ngày sinh"
									type="date"
									placeholder="mm/dd/yyyy"
									value={dob}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDob(e.target.value)}
									icon="calendar"
									required={false}
									inputSize="sm"
								/>
								<RegisterInputField
									id="idNumber"
									label="CMND/CCCD"
									placeholder="Số CMND/CCCD"
									value={idNumber}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdNumber(e.target.value)}
									icon="id"
									required={false}
									inputSize="sm"
								/>
							</div>

							<RegisterInputField
								id="address"
								label="Địa chỉ"
								placeholder="Nhập địa chỉ của bạn..."
								value={address}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
								icon="address"
								required={false}
								inputSize="sm"
							/>

							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<Button type="submit" className="w-full h-11 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg">
								Đăng ký tài khoản
							</Button>
						</form>

						<div className="text-center space-y-1">
							<p className="text-sm text-gray-600">Đã có tài khoản?{' '}<button className="text-blue-600 hover:underline" onClick={onBackToLogin}>Đăng nhập ngay</button></p>
							<div><button className="text-sm text-gray-700 hover:text-gray-900 hover:underline" onClick={onBackToHome}>← Quay lại trang chủ</button></div>
						</div>

						<div className="pt-3 border-t border-gray-100 text-center">
							<p className="text-xs text-gray-500">© 2024 LIMS - Laboratory Information Management System</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


