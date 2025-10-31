import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TestTube } from "lucide-react";
import { LoginForm } from "../pages/login/LoginForm";
import { BubbleBackground } from "@/components/common/bubble-background";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect } from "react";
import type { User } from "../types/User";
export const LoginLayout = () => {
  const navigate = useNavigate();
  const { user, onLogin } = useAuthContext(); // ✅ lấy onLogin từ context

  // ✅ định nghĩa hàm login
  const handleLogin = (userData: User) => {
    onLogin(userData); // lưu vào context và localStorage
    toast.success("Đăng nhập thành công!");
  };

  useEffect(() => {
    if (user && user.role?.length > 0) {
      const firstRole = user.role[0];
      switch (firstRole) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "MANAGER":
          navigate("/manager");
          break;
        case "SERVICE":
          navigate("/service");
          break;
        case "LAB_USER":
          navigate("/labuser");
          break;
        case "USER":
          navigate("/user");
          break;
        default:
          navigate("/home");
          break;
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Bubble Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <BubbleBackground className="absolute inset-0" />
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
          
          {/* Decorative Elements - removed, handled by BubbleBackground */}
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
