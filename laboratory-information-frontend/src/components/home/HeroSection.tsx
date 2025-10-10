import Button from '../common/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { 
  Sparkles,
  ArrowRight,
  Heart,
  TrendingUp,
  Award,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';

interface HeroSectionProps {
  onShowLogin: () => void;
  onShowRegister?: () => void;
}

export function HeroSection({ onShowLogin, onShowRegister }: HeroSectionProps) {
  const stats = [
    { number: "99.9%", label: "Độ tin cậy hệ thống", icon: <Award className="h-5 w-5 text-blue-600" /> },
    { number: "6", label: "Loại người dùng", icon: <Users className="h-5 w-5 text-green-600" /> },
    { number: "24/7", label: "Hỗ trợ liên tục", icon: <Clock className="h-5 w-5 text-purple-600" /> },
    { number: "100%", label: "Tuân thủ quy định", icon: <CheckCircle className="h-5 w-5 text-orange-600" /> }
  ];

  return (
    <section className="px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700">Giải pháp LIMS hiện đại</span>
              </div>
              <h1 className="text-5xl text-gray-900 leading-tight">
                Hệ thống quản lý{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  phòng thí nghiệm
                </span>{' '}
                toàn diện
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Giải pháp LIMS đầy đủ cho phòng lab đơn lẻ với quản lý bệnh nhân, 
                theo dõi mẫu bằng mã vạch, đặt hàng xét nghiệm và báo cáo tài chính thông minh.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {onShowRegister && (
                <Button 
                  onClick={onShowRegister}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Đăng ký miễn phí
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              <Button 
                onClick={onShowLogin}
                variant="outline" 
                size="lg"
                className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Đăng nhập
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    {stat.icon}
                    <div className="text-2xl text-gray-900">{stat.number}</div>
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-sm">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1576669801838-1b1c52121e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYWJvcmF0b3J5JTIwbWVkaWNhbCUyMHRlc3Rpbmd8ZW58MXx8fHwxNzU5NDgzMDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern laboratory"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
            </div>
            {/* Floating cards */}
            <div className="absolute -top-6 -left-6 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-red-500" />
                <div>
                  <div className="text-sm text-gray-900">Sức khỏe bệnh nhân</div>
                  <div className="text-xs text-gray-600">Ưu tiên hàng đầu</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <div>
                  <div className="text-sm text-gray-900">Hiệu quả 99.9%</div>
                  <div className="text-xs text-gray-600">Độ chính xác cao</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
