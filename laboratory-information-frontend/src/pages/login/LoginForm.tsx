import React, { useState } from "react";
import { Alert, AlertDescription } from "../../components/common/alert";
import Button from "../../components/common/button";
import { CardTitle, CardDescription } from '../../components/common/card';
import { Shield} from 'lucide-react';
import { authenticateUser } from "../../hooks/loginApi";
import type { LoginFormProps } from "../../types/Login.type";
import  {LoginInputField} from "./LoginFormInputField";

export function LoginForm({ onLogin, onShowForgotPassword, onShowRegister, onBackToHome }: LoginFormProps) {
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
    <div className="max-w-md mx-auto">
      {/* Login Header */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
      </div>

      <CardTitle className="text-2xl text-gray-900 mb-2 leading-tight text-center">
        Hệ Thống Quản Lý Thông Tin <br />
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Phòng Thí Nghiệm
        </span>
      </CardTitle>
      <CardDescription className="text-sm text-gray-600 max-w-sm mx-auto text-center mb-6">
        Đăng nhập để truy cập bảng điều khiển
      </CardDescription>

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

        <Button type="submit" className="w-full h-12 bg-gray-800 text-white rounded-lg">
          Đăng nhập
        </Button>
      </form>

      {/* Footer Links */}
      <div className="text-center space-y-2 mt-4">
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
          onClick={() => onBackToHome?.()}
          className="text-sm text-gray-700 hover:text-gray-900 hover:underline"
        >
          ← Quay lại trang chủ
        </button>
      </div>
    </div>
  );
}
