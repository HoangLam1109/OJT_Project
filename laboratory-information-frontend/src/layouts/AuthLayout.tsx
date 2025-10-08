import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/common/card';
import { Button } from '../components/common/button';
import { Input } from '../components/common/input';
import { Label } from '../components/common/label';
import { Alert, AlertDescription } from '../components/common/alert';
import type { User } from '../App';
import { toast } from 'sonner';
import { authenticateUser } from '../data/mockData';
import { Shield, Mail, Lock } from 'lucide-react';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onShowForgotPassword: () => void;
  onBackToHome?: () => void;
  embedded?: boolean;
}

export function LoginForm({ onLogin, onShowForgotPassword, onBackToHome, embedded = false }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Check credentials
    const user = authenticateUser(email, password);

    if (user) {
      // Check if staff member is within work hours
      if (user.role === 'laboratory_manager' || user.role === 'service' || user.role === 'lab_user') {
        const now = new Date();
        const currentDay = now.toLocaleDateString('vi-VN', { weekday: 'long' });
        const currentTime = now.toTimeString().slice(0, 5);
        
        if (user.schedule) {
          const isWorkDay = user.schedule.workDays.includes(currentDay);
          const isWorkHours = currentTime >= user.schedule.startTime && currentTime <= user.schedule.endTime;
          
          if (!isWorkDay || !isWorkHours) {
            toast.warning('Phát hiện truy cập ngoài giờ làm việc. Có thể cần quyền quản trị viên.');
          }
        }
      }

      const { password: _, ...userWithoutPassword } = user;
      onLogin(userWithoutPassword);
      toast.success(`Chào mừng, ${user.name}!`);
    } else {
      setError('Thông tin đăng nhập không đúng');
    }
  };

  const containerClasses = embedded 
    ? ""
    : "min-h-screen flex items-center justify-center bg-background p-4";

  const cardClasses = embedded
    ? "w-full"
    : "w-full max-w-md relative z-10";

  const headerClasses = embedded
    ? "text-center pb-4 pt-4"
    : "text-center pb-6 pt-6";

  const contentClasses = embedded
    ? "space-y-4 px-2 pb-4"
    : "space-y-6 px-6 pb-6";

  return (
    <div className={containerClasses}>
      {!embedded && (
        <>
          {/* Simplified Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-slate-200/20 to-gray-300/20 rounded-full blur-2xl"></div>
          </div>
        </>
      )}

      {/* Main Login Card */}
      <Card className={cardClasses}>
        <CardHeader className={headerClasses}>
          {!embedded && (
            <>
              {/* Simplified Logo Section */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>
              
              {/* Simplified Title */}
              <CardTitle className="text-2xl text-gray-900 mb-2 leading-tight">
                Hệ Thống Quản Lý Thông Tin
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Phòng Thí Nghiệm
                </span>
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 max-w-sm mx-auto">
                Đăng nhập để truy cập hệ thống
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className={contentClasses}>
          <form onSubmit={handleSubmit} className={embedded ? "space-y-4" : "space-y-6"}>
            <div className="space-y-2">
              <Label htmlFor="email" className={embedded ? "text-sm text-gray-700" : "text-sm text-gray-700"}>Địa chỉ Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập địa chỉ email..."
                  className={embedded 
                    ? "pl-10 h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg bg-gray-50/50 hover:bg-white transition-all duration-200"
                    : "pl-10 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg bg-gray-50/50 hover:bg-white transition-all duration-200"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className={embedded ? "text-sm text-gray-700" : "text-sm text-gray-700"}>Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu..."
                  className={embedded 
                    ? "pl-10 h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg bg-gray-50/50 hover:bg-white transition-all duration-200"
                    : "pl-10 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg bg-gray-50/50 hover:bg-white transition-all duration-200"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 p-4 rounded-xl">
                <AlertDescription className={embedded ? "text-sm" : "text-base"}>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className={embedded 
                ? "w-full h-10 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-black hover:to-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-lg"
                : "w-full h-12 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-black hover:to-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-lg"
              }
            >
              Đăng nhập vào hệ thống
            </Button>
          </form>

          <div className="text-center space-y-2">
            <Button 
              variant="link" 
              className={embedded ? "text-sm text-gray-600 hover:text-blue-600 transition-colors" : "text-base text-gray-600 hover:text-blue-600 transition-colors"}
              onClick={onShowForgotPassword}
            >
              Quên mật khẩu?
            </Button>
            {!embedded && onBackToHome && (
              <div>
                <Button 
                  variant="link" 
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={onBackToHome}
                >
                  ← Quay lại trang chủ
                </Button>
              </div>
            )}
          </div>

          {/* Streamlined Demo Accounts Section - Only show when not embedded */}
          {!embedded && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg border border-gray-100/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <p className="text-sm text-gray-800 font-medium">Tài khoản Demo</p>
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Admin:</span>
                    <span className="text-gray-900 bg-white/70 px-2 py-1 rounded text-xs">admin@lab.com / admin123</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Manager:</span>
                    <span className="text-gray-900 bg-white/70 px-2 py-1 rounded text-xs">manager@lab.com / manager123</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Service:</span>
                    <span className="text-gray-900 bg-white/70 px-2 py-1 rounded text-xs">service@lab.com / service123</span>
                  </div>
                </div>
              </div>

              {/* Footer branding */}
              <div className="text-center pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  © 2024 LIMS - Laboratory Information Management System
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}