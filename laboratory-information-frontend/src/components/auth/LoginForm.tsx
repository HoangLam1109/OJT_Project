import React, { useState } from 'react';
import Button from '../common/button';
import { Alert, AlertDescription } from '../common/alert';
import { toast } from 'sonner';
import { authenticateUser } from '../../data/mockData';
import type { User } from '../../types';
import { LoginHeader } from './LoginHeader';
import { LoginInputField } from './LoginInputField';
import { LoginDemoAccounts } from './LoginDemoAccounts';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onShowForgotPassword: () => void;
  onBackToHome?: () => void;
  onShowRegister?: () => void;
}

export function LoginForm({ onLogin, onShowForgotPassword, onBackToHome, onShowRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = authenticateUser(email, password);
    if (user) {
      toast.success(`Chào mừng, ${user.name}!`);
      onLogin(user as User);
    } else {
      setError('Sai thông tin đăng nhập');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="w-full max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-6 pt-6 pb-4 text-center">
            <LoginHeader />
          </div>


          <div className="px-5 pb-4 space-y-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <LoginInputField
                id="email"
                label="Địa chỉ Email"
                type="email"
                placeholder="Nhập địa chỉ email của bạn..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon="mail"
              />
              <LoginInputField
                id="password"
                label="Mật khẩu"
                type="password"
                placeholder="Nhập mật khẩu của bạn..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon="lock"
              />


              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg">
                Đăng nhập vào hệ thống
              </Button>
            </form>

            <div className="text-center space-y-2">
              <button 
                type="button"
                onClick={onShowForgotPassword}
                className="text-sm text-gray-700 hover:text-gray-900 hover:underline"
              >
                Quên mật khẩu?
              </button>

              <div className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <button 
                  type="button"
                  onClick={onShowRegister}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Đăng ký ngay
                </button>
              </div>

              <button 
                type="button"
                onClick={onBackToHome}
                className="text-sm text-gray-700 hover:text-gray-900 hover:underline"
              >
                ← Quay lại trang chủ
              </button>
            </div>

            <LoginDemoAccounts />
          </div>
        </div>
      </div>
    </div>
  );
}
