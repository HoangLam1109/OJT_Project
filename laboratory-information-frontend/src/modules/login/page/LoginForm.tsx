import React, { useState } from "react";
import { Alert, AlertDescription } from "../../../components/common/alert";
import Button from "../../../components/common/button";
import type { LoginFormProps } from "../types/LoginFormProps";
import { authenticateUser } from "../services/loginApi";

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
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          onClick={() => onBackToHome?.()}
          className="text-sm text-gray-700 hover:text-gray-900 hover:underline"
        >
          ← Quay lại trang chủ
        </button>
      </div>
    </>
  );
}
