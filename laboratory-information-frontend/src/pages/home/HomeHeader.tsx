import { Microscope, ArrowRight, LogOut } from "lucide-react";
import Button from "../../components/common/button";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../service/authService/logoutApi";

interface HomeHeaderProps {
  onShowLogin: () => void;
  onShowRegister: () => void; 
}

export function HomeHeader({ onShowLogin, onShowRegister }: HomeHeaderProps) {
  const { t, i18n } = useTranslation();
  const { user, onLogout } = useAuthContext();
  const navigate = useNavigate();
  const [, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const lastYRef = useRef(0);
  const currentLanguage = i18n.language || "vi";

  const toggleLanguage = () => {
    const newLang = currentLanguage === "vi" ? "en" : "vi";
    i18n.changeLanguage(newLang);
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
      className={`px-6 py-3 transition-transform duration-300 will-change-transform ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between rounded-xl transition-all duration-300 bg-transparent">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
            <Microscope className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-gray-900 font-semibold">{t("header.appName")}</h1>
            <p className="text-sm text-gray-600">
              {t("header.appDescription")}
            </p>
          </div>
        </div>

        {/* Language Switcher + Login/Register or User Info + Logout */}
        <div className="flex items-center gap-3">
          {/* Language Toggle Switch */}
          <div
            onClick={toggleLanguage}
            className="relative flex items-center bg-gray-100 rounded-full px-1.5 py-1 cursor-pointer transition-all duration-300 hover:bg-gray-200 shadow-sm"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleLanguage();
              }
            }}
            title={currentLanguage === "en" ? "Switch to Vietnamese" : "Chuyển sang Tiếng Anh"}
          >
            {/* Toggle Track */}
            <div className="relative flex items-center w-16 h-9">
              {/* Toggle Button with Flag */}
              <div
                className={`absolute top-0.5 bottom-0.5 w-8 h-8 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center overflow-hidden ${
                  currentLanguage === "vi" ? "translate-x-[2rem]" : "translate-x-0"
                }`}
              >
                {currentLanguage === "vi" ? (
                  <svg width="18" height="18" viewBox="0 0 20 20" className="rounded-full">
                    <rect width="20" height="20" fill="#DA020E" />
                    <path
                      d="M10 5L11.18 8.09L14.5 8.64L12 11.18L12.64 14.5L10 12.82L7.36 14.5L8 11.18L5.5 8.64L8.82 8.09L10 5Z"
                      fill="#FFD700"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 20 20" className="rounded-full">
                    <rect width="20" height="20" fill="#012169" />
                    <path d="M0 0L20 20M20 0L0 20" stroke="#FFF" strokeWidth="2.5" />
                    <path d="M0 10L20 10M10 0L10 20" stroke="#FFF" strokeWidth="3.5" />
                    <path d="M0 0L20 20M20 0L0 20" stroke="#C8102E" strokeWidth="1.2" />
                    <path d="M0 10L20 10M10 0L10 20" stroke="#C8102E" strokeWidth="2" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {user ? (
            /* User is logged in - Show greeting, username, and logout button */
            <>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
                <span className="font-medium text-gray-700">{t("header.hello")},</span>
                <span className="font-semibold text-gray-900">{user.name}</span>
              </div>
              <Button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {logoutLoading ? (
                  t("header.loggingOut")
                ) : (
                  <>
                    {t("header.logout")}
                    <LogOut className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </>
          ) : (
            /* User is not logged in - Show register and login buttons */
            <>
              <Button
                onClick={onShowRegister}
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {t("header.register")}
              </Button>

              <Button
                onClick={onShowLogin}
                className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-black hover:to-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {t("header.login")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
