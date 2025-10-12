
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoginForm } from "../components/LoginForm";
import { LoginHeader } from "../components/LoginFormHeader";
import { LoginDemoAccounts } from "../components/LoginDemoAccounts";
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
    case 'admin':
      navigate('/admin');
      break;
    case 'laboratory_manager':
      navigate('/labmanager');
      console.log('role', user.role);
      break;
     case 'service':
      navigate('/service');
      console.log('role', user.role);
      break;
    case 'normal_user':
    default:
      navigate('/home');
      break;
  }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="w-full max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
          <div className="px-6 pt-6 pb-4 text-center">
            <LoginHeader />
          </div>

          <div className="px-5 pb-4 space-y-3">
            <LoginForm
              onLogin={handleLogin}
              onShowForgotPassword={onShowForgotPassword}
              onBackToHome={() => navigate("/")}
              onShowRegister={onShowRegister}
            />
            <LoginDemoAccounts />
          </div>
        </div>
      </div>
    </div>
  );
}
