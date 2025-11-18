import { useNavigate } from "react-router-dom";
import { TestTube } from "lucide-react";
import { RegisterForm } from "../pages/register/RegisterForm";
import { BubbleBackground } from "@/components/common/bubble-background";
import { useTranslation } from "react-i18next";
export function RegisterLayout() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
              <h1 className="text-4xl font-bold mb-4">{t("register.title1")}</h1>
              <h2 className="text-2xl font-semibold text-blue-100">{t("register.subtitle")}</h2>
            </div>
            
            {/* Features */}
            <div className="space-y-4 text-left max-w-md">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-100">{t("register.patientManagement")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-100">{t("register.reportAnalysis")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-100">{t("register.patientHistory")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-100">{t("register.highSecurity")}</span>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements - removed, handled by BubbleBackground */}
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
