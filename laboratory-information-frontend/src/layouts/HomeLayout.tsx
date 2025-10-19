import type { LoginAndRegisterType } from '../types/Login.type'; 
import {
  HeroSection,
  FeaturesSection,
  AboutSection,
  ServicesSection,
  TestimonialsSection,
  FAQSection,
  ContactSection,
  CTASection,
  Footer,
  HomeHeader,
  HomeBanner
} from '../pages/home';


export function HomePage({ onShowLogin, onShowRegister }: LoginAndRegisterType) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/5 to-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <HomeBanner onShowRegister={onShowRegister}/>

        <HomeHeader onShowLogin={onShowLogin} />

        {/* Main Content Sections */}
        <HeroSection onShowLogin={onShowLogin} onShowRegister={onShowRegister} />
        <FeaturesSection />
        <AboutSection onShowLogin={onShowLogin} />
        <ServicesSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
        <CTASection onShowLogin={onShowLogin} />


        <Footer />
      </div>
    </div>
  );
}