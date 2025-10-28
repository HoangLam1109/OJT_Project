import { useNavigate } from "react-router-dom";
import { TestTube } from "lucide-react";
import { RegisterForm } from "../pages/register/RegisterForm";

export function RegisterLayout() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Medical Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-8">
          {/* Medical Icons and Content */}
          <div className="text-center space-y-6">
            {/* Test Tube Icon */}
            <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TestTube className="w-10 h-10 text-white" />
            </div>
            
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold mb-3">Hệ Thống Quản Lý</h1>
              <h2 className="text-xl font-semibold text-blue-100">Phòng Thí Nghiệm Y Khoa</h2>
            </div>
            
            {/* Features */}
            <div className="space-y-3 text-left max-w-sm">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-100 text-sm">Quản lý bệnh nhân và xét nghiệm</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-100 text-sm">Báo cáo kết quả chính xác</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-100 text-sm">Theo dõi lịch sử bệnh án</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-100 text-sm">Bảo mật thông tin cao</span>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-8 left-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-8 right-8 w-20 h-20 bg-blue-300/20 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 right-16 w-12 h-12 bg-white/5 rounded-full blur-md"></div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto px-4 py-4">
          <RegisterForm
            onBackToLogin={() => navigate('/login')}
            onBackToHome={() => navigate('/')}
          />
        </div>
      </div>
    </div>
  );
}
