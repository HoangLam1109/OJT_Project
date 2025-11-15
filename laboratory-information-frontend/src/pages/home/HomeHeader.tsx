import { Microscope, ArrowRight, Globe } from "lucide-react";
import Button from "../../components/common/button";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface HomeHeaderProps {
  onShowLogin: () => void;
  onShowRegister: () => void; 
}

export function HomeHeader({ onShowLogin, onShowRegister }: HomeHeaderProps) {
  const { t, i18n } = useTranslation();
  const [, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const currentLanguage = i18n.language || "vi";

  const toggleLanguage = () => {
    const newLang = currentLanguage === "vi" ? "en" : "vi";
    i18n.changeLanguage(newLang);
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

        {/* Language Switcher + Login + Register Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={toggleLanguage}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            title={currentLanguage === "en" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
          >
            <Globe className="h-4 w-4" />
            <span className="uppercase font-semibold">{currentLanguage === "vi" ? "EN" : "VI"}</span>
          </Button>

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
        </div>
      </nav>
    </header>
  );
}
