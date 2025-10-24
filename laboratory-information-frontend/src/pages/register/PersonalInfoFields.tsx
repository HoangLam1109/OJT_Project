import { RegisterInputField } from './RegisterInputField';
import type { PersonalInfoFieldsProps } from './types/register';


export function PersonalInfoFields({ fullName, setFullName, email, setEmail, password, confirmPassword, setConfirmPassword, passwordError, handlePasswordChange }: PersonalInfoFieldsProps) {
    return (
        <div className="space-y-3">
            <RegisterInputField
                id="fullName"
                label="Họ và tên"
                type="text"
                placeholder="Nhập họ và tên..."
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                icon="user"
                required
            />
            <RegisterInputField
                id="email"
                label="Địa chỉ Email"
                type="email"
                placeholder="Nhập email..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon="mail"
                required
            />
            <div className="space-y-1">
                <RegisterInputField
                    id="password"
                    label="Mật khẩu"
                    type="password"
                    placeholder="Nhập mật khẩu..."
                    value={password}
                    onChange={handlePasswordChange}
                    icon="lock"
                    required
                />
                {passwordError && (
                    <p className="text-xs text-red-500">{passwordError}</p>
                )}
            </div>
            <RegisterInputField
                id="confirmPassword"
                label="Xác nhận mật khẩu"
                type="password"
                placeholder="Nhập lại mật khẩu..."
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                icon="lock"
                required
            />
        </div>
    );
}
