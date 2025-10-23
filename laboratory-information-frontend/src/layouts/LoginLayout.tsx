import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TestTube } from "lucide-react";
import { LoginForm } from "../pages/login/LoginForm";
import { useAuthContext } from "../hooks/useAuthContext";
import type { User } from "../types/User";

export function LoginLayout() {
  const navigate = useNavigate();
  const { onLogin } = useAuthContext();

  const handleLogin = (user: User) => {
    toast.success(`Chào mừng, ${user.name}!`);
    onLogin(user); 

    // Phân quyền điều hướng
    switch (user.role) {
      case 'ADMIN':
        navigate('/admin');
        break;
      case 'MANAGER':
        navigate('/manager');
        break;
      case 'SERVICE':
        navigate('/service');
        break;
      case 'LAB_USER':
        navigate('/labuser');
        break;
      case 'USER':
        navigate('/user');
        break;
      default:
        navigate('/home');
        break;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Medical Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          {/* Medical Icons and Content */}
          <div className="text-center space-y-8">
            {/* Test Tube Icon */}
            <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TestTube className="w-12 h-12 text-white" />
            </div>
            
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold mb-4">Hệ Thống Quản Lý</h1>
              <h2 className="text-2xl font-semibold text-blue-100">Phòng Thí Nghiệm Y Khoa</h2>
            </div>
            
            {/* Features */}
            <div className="space-y-4 text-left max-w-md">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-100">Quản lý bệnh nhân và xét nghiệm</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-100">Báo cáo kết quả chính xác</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-100">Theo dõi lịch sử bệnh án</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-100">Bảo mật thông tin cao</span>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-300/20 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 right-20 w-16 h-16 bg-white/5 rounded-full blur-md"></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md mx-auto px-8 py-12">
          <LoginForm
            onLogin={handleLogin}
            onShowRegister={() => {
              navigate("/register"); 
            }}
            onBackToHome={() => navigate("/")}
          />
        </div>
      </div>
    </div>
  );
}
