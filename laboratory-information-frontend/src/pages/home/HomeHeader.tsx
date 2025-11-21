import { Microscope, ArrowRight, LogOut } from "lucide-react";
import Button from "../../components/common/button";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../service/authService/logoutApi";
import { LanguageToggle } from "../../components/common/LanguageToggle";

interface HomeHeaderProps {
  onShowLogin: () => void;
  onShowRegister: () => void; 
}

export function HomeHeader({ onShowLogin, onShowRegister }: HomeHeaderProps) {
  const { t } = useTranslation();
  const { user, onLogout } = useAuthContext();
  const navigate = useNavigate();
  const [, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const lastYRef = useRef(0);

  const getRolePath = () => {
    if (!user || !user.role || user.role.length === 0) return "/";
    
    // Thứ tự ưu tiên role
    const rolePriority: Array<'ADMIN' | 'MANAGER' | 'LAB_USER' | 'SERVICE' | 'USER'> = 
      ["ADMIN", "MANAGER", "LAB_USER", "SERVICE", "USER"];
    
    for (const role of rolePriority) {
      if (user.role.includes(role)) {
        switch (role) {
          case "ADMIN":
            return "/admin/dashboard";
          case "MANAGER":
            return "/manager/user-management";
          case "LAB_USER":
            return "/labuser/dashboard";
          case "SERVICE":
            return "/service/dashboard";
          case "USER":
            return "/user/dashboard";
          default:
            return "/";
        }
      }
    }
    return "/";
  };

  const handleGoToDashboard = () => {
    const path = getRolePath();
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      onLogout();
      await logoutUser();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      onLogout();
      navigate("/", { replace: true });
    } finally {
      setLogoutLoading(false);
    }
  };

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
              setHidden(true); 
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
    <header
      className={`px-3 sm:px-6 py-3 transition-transform duration-300 will-change-transform ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between rounded-xl transition-all duration-300 bg-transparent">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
            <Microscope className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl text-gray-900 font-semibold">{t("header.appName")}</h1>
            <p className="text-xs sm:text-sm text-gray-600">
              {t("header.appDescription")}
            </p>
          </div>
          <div className="block sm:hidden">
            <h1 className="text-base text-gray-900 font-semibold">{t("header.appName")}</h1>
          </div>
        </div>

        {/* Language Switcher + Login/Register or User Info + Logout */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Language Toggle Switch */}
          <LanguageToggle />

          {user ? (
            /* User is logged in - Show greeting, username, go to dashboard, and logout button */
            <>
              <div className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
                <span className="font-medium text-gray-700 text-sm">{t("header.hello")},</span>
                <span className="font-semibold text-gray-900 text-sm">{user.name}</span>
              </div>
              <Button
                onClick={handleGoToDashboard}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm px-2 sm:px-4"
              >
                <span className="hidden sm:inline">{t("header.goToDashboard")}</span>
                <span className="sm:hidden">Dashboard</span>
                <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed text-xs sm:text-sm px-2 sm:px-4"
              >
                {logoutLoading ? (
                  <span className="hidden sm:inline">{t("header.loggingOut")}</span>
                ) : (
                  <>
                    <span className="hidden sm:inline">{t("header.logout")}</span>
                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:ml-2" />
                  </>
                )}
              </Button>
            </>
          ) : (
            /* User is not logged in - Show register and login buttons */
            <>
              <Button
                onClick={onShowRegister}
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm px-2 sm:px-4"
              >
                {t("header.register")}
              </Button>

              <Button
                onClick={onShowLogin}
                className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-black hover:to-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm px-2 sm:px-4"
              >
                <span className="hidden sm:inline">{t("header.login")}</span>
                <span className="sm:hidden">Login</span>
                <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
