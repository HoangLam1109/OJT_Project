import { RegisterInputField } from './RegisterInputField';
import type { PersonalInfoFieldsProps } from '../types/register';


export function PersonalInfoFields({ fullName, setFullName, email, setEmail, password, confirmPassword, setConfirmPassword, passwordError, handlePasswordChange }: PersonalInfoFieldsProps) {
    return (
        <>
            <RegisterInputField
                id="fullName"
                label="Họ và tên"
                placeholder="Nhập họ và tên..."
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                icon="user"
                required
            />
            <RegisterInputField
                id="email"
                label="Địa chỉ Email"
                placeholder="Nhập email..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon="mail"
                required
            />
            <RegisterInputField
                id="password"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={handlePasswordChange}
                icon="lock"
                inputSize="sm"
                required
            />
            {passwordError && <p className="text-xs text-red-500 -mt-1">{passwordError}</p>}

            <RegisterInputField
                id="confirmPassword"
                label="Xác nhận mật khẩu"
                placeholder="Nhập lại mật khẩu..."
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                icon="lock"
                inputSize="sm"
                required
            />
        </>
    );
}
