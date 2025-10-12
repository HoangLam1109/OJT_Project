import { Card, CardContent } from '../../../components/common/card'
import Button from '../../../components/common/button';
import { 
  Phone,
  Mail,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { SiFacebook, SiX, SiInstagram, SiLinkedin, SiYoutube } from 'react-icons/si';

export function ContactSection() {
  return (
    <section className="px-6 py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl text-gray-900 mb-4">
                Liên hệ <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">tư vấn</span>
              </h2>
              <p className="text-xl text-gray-600">
                Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ để được tư vấn miễn phí!
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-900">Hotline</div>
                  <div className="text-gray-600">1900 1234 (miễn phí)</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-gray-900">Email</div>
                  <div className="text-gray-600">support@limspro.vn</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-gray-900">Địa chỉ</div>
                  <div className="text-gray-600">123 Đường ABC, Quận 1, TP.HCM</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-gray-900">Theo dõi chúng tôi</h4>
              <div className="flex gap-4">
                {[
                  { 
                    Icon: SiFacebook, 
                    color: "text-blue-600",
                    title: "Facebook"
                  },
                  { 
                    Icon: SiX, 
                    color: "text-sky-500",
                    title: "X (Twitter)"
                  },
                  { 
                    Icon: SiInstagram, 
                    color: "text-pink-600",
                    title: "Instagram"
                  },
                  { 
                    Icon: SiLinkedin, 
                    color: "text-blue-700",
                    title: "LinkedIn"
                  },
                  { 
                    Icon: SiYoutube, 
                    color: "text-red-600",
                    title: "YouTube"
                  }
                ].map((social, index) => (
                  <Button key={index} variant="outline" size="sm" className="p-2" title={social.title}>
                    <social.Icon className={`h-5 w-5 ${social.color}`} />
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Card className="bg-white border-0 shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl text-gray-900 mb-6">Đăng ký tư vấn miễn phí</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Họ tên *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="Nhập họ tên"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Số điện thoại *</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email *</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Tên phòng lab</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="Nhập tên phòng lab"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Ghi chú</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="Nhập yêu cầu tư vấn của bạn"
                  ></textarea>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3">
                  Gửi yêu cầu tư vấn
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
