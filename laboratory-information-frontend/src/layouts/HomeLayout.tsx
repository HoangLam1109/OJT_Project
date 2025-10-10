import Button from '../components/common/button';
import { 
  Microscope, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  HeroSection,
  FeaturesSection,
  AboutSection,
  ServicesSection,
  TestimonialsSection,
  FAQSection,
  ContactSection,
  CTASection,
  Footer
} from '../components/home';

interface HomePageProps {
  onShowLogin: () => void;
  onShowRegister?: () => void;
}

export function HomePage({ onShowLogin, onShowRegister }: HomePageProps) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/5 to-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Announcement Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <p className="text-sm md:text-base">
              🎉 <strong>Khuyến mãi đặc biệt:</strong> Miễn phí thiết lập và đào tạo cho 100 phòng lab đầu tiên đăng ký trong tháng này!
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600 hidden md:inline-flex"
            >
              Đăng ký ngay
            </Button>
          </div>
        </div>
        
        {/* Header */}
        <header className="px-6 py-4">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
                <Microscope className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-gray-900">LIMS Pro</h1>
                <p className="text-sm text-gray-600">Laboratory Information Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {onShowRegister && (
                <Button 
                  onClick={onShowRegister}
                  variant="outline"
                  className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  Đăng ký
                </Button>
              )}
              <Button 
                onClick={onShowLogin}
                className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-black hover:to-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Đăng nhập
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </nav>
        </header>

        {/* Main Content Sections */}
        <HeroSection onShowLogin={onShowLogin} onShowRegister={onShowRegister} />
        <FeaturesSection />
        <AboutSection onShowLogin={onShowLogin} />
        <ServicesSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
        <CTASection onShowLogin={onShowLogin} onShowRegister={onShowRegister} />
        <Footer />
      </div>
    </div>
  );
}