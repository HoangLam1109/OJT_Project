import { Microscope, ArrowRight, LogOut, User } from "lucide-react";
import Button from "../../components/common/button";
import { useAuthContext } from "../../hooks/useAuthContext";
import type { LoginType } from "../../types/Login.type";
import { useEffect, useRef, useState } from "react";

interface HomeHeaderProps extends LoginType {
  onLogout?: () => void;
  onShowRegister?: () => void;
}

export function HomeHeader({ onShowLogin, onShowRegister, onLogout }: HomeHeaderProps) {
  const { user } = useAuthContext();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    let ticking = false;
    const threshold = 8; // px before we react to direction

    const onScroll = () => {
      const currentY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(currentY > 20);
          const delta = currentY - lastYRef.current;
          if (Math.abs(delta) > threshold) {
            if (delta > 0 && currentY > 60) {
              setHidden(true); // scrolling down
            } else {
              setHidden(false); // scrolling up
            }
          }
          lastYRef.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`px-6 py-3 transition-transform duration-300 will-change-transform ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      <nav
        className="max-w-7xl mx-auto flex items-center justify-between rounded-xl transition-all duration-300 bg-transparent"
      >
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
            // User is not logged in - show register and login buttons
            <div className="flex items-center gap-3">
              <Button
                onClick={onShowRegister}
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Đăng ký
              </Button>
              <Button
                onClick={onShowLogin}
                className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-black hover:to-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Đăng nhập
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
