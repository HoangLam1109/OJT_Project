
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoginForm } from "./LoginForm";
import type { LoginFormProps } from "../types/LoginFormProps";
import type { User } from "../types/User";

export function LoginPage({
  onLogin,
  onShowForgotPassword,
  onShowRegister,
}: LoginFormProps) {

  const navigate = useNavigate();

  const handleLogin = (user: User) => {
    toast.success(`Chào mừng, ${user.name}!`);
    onLogin(user);
    
    // Phân quyền dựa trên role
    switch (user.role) {
      case 'ADMIN':
        navigate('/admin');
        break;
      case 'MANAGER':
        navigate('/labmanager');
        console.log('role', user.role);
        break;
      case 'SERVICE':
        navigate('/service');
        console.log('role', user.role);
        break;
      case 'LAB_USER':
        navigate('/labuser');
        console.log('role', user.role);
        break;
        case 'USER':
        navigate('/normaluser');
        console.log('role', user.role);
        break;
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

            {/* Login Form */}
            <LoginForm
              onLogin={handleLogin}
              onShowForgotPassword={onShowForgotPassword}
              onBackToHome={() => navigate("/")}
              onShowRegister={onShowRegister}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
