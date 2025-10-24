import { Microscope, ArrowRight, LogOut, User } from "lucide-react";
import Button from "../../components/common/button";
import { useAuthContext } from "../../hooks/useAuthContext";
import type { LoginType } from "../../types/Login.type";

interface HomeHeaderProps extends LoginType {
  onLogout?: () => void;
}

export function HomeHeader({ onShowLogin, onLogout }: HomeHeaderProps) {
  const { user } = useAuthContext();

  return (
    <header className="px-6 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
            <Microscope className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-gray-900 font-semibold">LIMS Pro</h1>
            <p className="text-sm text-gray-600">Laboratory Information Management System</p>
          </div>
        </div>

        {/* User Info or Login Button */}
        <div className="flex items-center gap-3">
          {user ? (
            // User is logged in - show user info and logout
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Xin chào, {user.name}
                </span>
              </div>
              <Button
                onClick={onLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </Button>
            </div>
          ) : (
            // User is not logged in - show login button
            <Button
              onClick={onShowLogin}
              className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-black hover:to-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Đăng nhập
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
