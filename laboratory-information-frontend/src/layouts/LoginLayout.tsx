import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoginForm } from "../pages/login/LoginForm";
import { useAuthContext } from "../hooks/useAuthContext";
import type { User } from "../types/User";

export function LoginLayout() {
  const navigate = useNavigate();
  const { onLogin } = useAuthContext();

  const handleLogin = (user: User) => {
    toast.success(`Chào mừng, ${user.name}!`);
    onLogin(user); // 

    // Phân quyền điều hướng
    switch (user.role) {
      case 'ADMIN':
        navigate('/admin');
        break;
      case 'MANAGER':
        navigate('/manager');
        break;
      // case 'SERVICE':
      //   navigate('/service');
      //   break;
      // case 'LAB_USER':
      //   navigate('/labuser');
      //   break;
      default:
        navigate('/home');
        break;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 py-10">
            <LoginForm
              onLogin={handleLogin}
              // onShowForgotPassword={onShowForgotPassword}
              onShowRegister={() => {
                navigate("/register"); 
              }}
              onBackToHome={() => navigate("/")}
            />

          </div>
        </div>
      </div>
    </div>
  );
}
