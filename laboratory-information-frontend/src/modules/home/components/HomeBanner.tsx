import { Sparkles } from "lucide-react";
import Button from "../../../components/common/button";
import type { RegisterType } from "../../../types";

export function HomeBanner({ onShowRegister }: RegisterType) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
        <Sparkles className="h-5 w-5 animate-pulse" />
        <p className="text-sm md:text-base">
          🎉 <strong>Khuyến mãi đặc biệt:</strong> Miễn phí thiết lập và đào tạo cho 100 phòng lab đầu tiên đăng ký trong tháng này!
        </p>
        <Button
          onClick={onShowRegister}
          size="sm"
          variant="outline"
          className="border-white text-white hover:bg-white hover:text-blue-600 hidden md:inline-flex"
        >
          Đăng ký ngay
        </Button>
      </div>
    </div>
  );
}
