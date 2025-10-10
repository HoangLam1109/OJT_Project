import React, { useState } from 'react';
import { Button } from '../common/button';
import { Alert, AlertDescription } from '../common/alert';
import { toast } from 'sonner';
import { authenticateUser } from '../../data/mockData';
import type { User } from '../../App';
import { LoginHeader } from './LoginHeader';
import { LoginInputField } from './LoginInputField';
import { LoginDemoAccounts } from './LoginDemoAccounts';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onShowForgotPassword: () => void;
  onBackToHome?: () => void;
}

export function LoginForm({ onLogin, onShowForgotPassword, onBackToHome }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = authenticateUser(email, password);
    if (user) {
      toast.success(`Chào mừng, ${user.name}!`);
      onLogin(user);
    } else {
      setError('Sai thông tin đăng nhập');
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center pb-6 pt-6">
        <LoginHeader />
      </div>

      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <LoginInputField
            id="email"
            label="Địa chỉ Email"
            type="email"
            placeholder="Nhập email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="mail"
          />
          <LoginInputField
            id="password"
            label="Mật khẩu"
            type="password"
            placeholder="Nhập mật khẩu..."
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
            Đăng nhập
          </Button>
        </form>

        <div className="text-center space-y-2">
          <Button variant="link" onClick={onShowForgotPassword}>
            Quên mật khẩu?
          </Button>

          <Button variant="link" onClick={onBackToHome}>
            ← Quay lại trang chủ
          </Button>
        </div>

        <LoginDemoAccounts />
      </div>
    </div>
  );
}
