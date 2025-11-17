
import Button from '../../components/common/button';
import { 
  Microscope,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ArrowUp,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  BookOpen,
  GraduationCap,
  Headphones,
  LifeBuoy,
  MessageSquare
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 text-white">
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
                  <Microscope className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-white">LIMS Pro</div>
                  <div className="text-gray-400 text-sm">Laboratory Information Management System</div>
                </div>
              </div>
              <p className="text-gray-400">
                {t("footer.description")}
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Facebook, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Linkedin, href: "#" },
                  { icon: Youtube, href: "#" }
                ].map((social, index) => (
                  <a key={index} href={social.href} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Products */}
            <div className="space-y-6">
              <h4 className="text-white">{t("footer.products")}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">LIMS Pro Basic</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LIMS Pro Advanced</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LIMS Pro Enterprise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Add-ons & Modules</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h4 className="text-white">{t("footer.support")}</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <a href="#" className="hover:text-white transition-colors">{t("footer.documentation")}</a>
                </li>
                <li className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <a href="#" className="hover:text-white transition-colors">{t("footer.training")}</a>
                </li>
                <li className="flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  <a href="#" className="hover:text-white transition-colors">{t("footer.support247")}</a>
                </li>
                <li className="flex items-center gap-2">
                  <LifeBuoy className="h-4 w-4" />
                  <a href="#" className="hover:text-white transition-colors">{t("footer.helpCenter")}</a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <a href="#" className="hover:text-white transition-colors">{t("footer.community")}</a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-6">
              <h4 className="text-white">{t("footer.contact")}</h4>
              <div className="space-y-4 text-gray-400">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4" />
                  <span>1900 1234 ({t("footer.free")})</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4" />
                  <span>support@limspro.vn</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-1" />
                  <span>{t("footer.address")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4" />
                  <span>{t("footer.time")}</span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="space-y-3">
                <h5 className="text-white text-sm">{t("footer.newsletter")}</h5>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder={t("footer.emailPlaceholder")} 
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-gray-400 text-sm">
                © 2024 LIMS Pro. Tất cả quyền được bảo lưu. Phiên bản dành cho phòng thí nghiệm đơn lẻ.
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
                <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                <a href="#" className="hover:text-white transition-colors">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <Button 
        className="fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  );
}
