import React, { useState } from "react";
import { Alert, AlertDescription } from "../../components/common/alert";
import Button from "../../components/common/button";
import { TestTube } from 'lucide-react';
import { authenticateUser } from "../../service/authService/loginApi";
import type { LoginFormProps } from "../../types/Login.type";
import { LoginInputField } from "./LoginFormInputField";

export function LoginForm({ onLogin, onShowRegister, onBackToHome }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = await authenticateUser(email, password);
    if (user) onLogin(user);
    else setError("Sai thông tin đăng nhập");
  };

  return (
    <div className="w-full">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <TestTube className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Chào mừng trở lại
        </h1>
        <p className="text-gray-600 text-sm">
          Đăng nhập để tiếp tục sử dụng hệ thống
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <LoginInputField
          id="email"
          label="Email"
          placeholder="Nhập email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon="mail"
        />
        <LoginInputField
          id="password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon="lock"
        />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg active:scale-95 transform transition-all duration-150 hover:from-blue-700 hover:to-indigo-700 focus:from-blue-700 focus:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5"
        >
          Đăng nhập
        </Button>

      </form>

      {/* Footer Links */}
      <div className="text-center space-y-3 mt-6">
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          Quên mật khẩu?
        </button>

        <div className="text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <button
            type="button"
            onClick={onShowRegister}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            Đăng ký ngay
          </button>
        </div>

        <button
          type="button"
          onClick={() => onBackToHome?.()}
          className="text-sm text-gray-500 hover:text-gray-700 hover:underline flex items-center justify-center gap-1 mx-auto"
        >
          ← Quay lại trang chủ
        </button>
      </div>
    </div>
  );
}
