import Button from '../../components/common/button';
import { 
  Phone,
  Mail,
  MapPin,
  
} from 'lucide-react';
import { SiFacebook, SiX, SiInstagram, SiLinkedin, SiYoutube } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
export function ContactSection() {
  const { t } = useTranslation();
  return (
    <section className="relative px-6 py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl text-gray-900 mb-4">
                {t("contact.title")}
              </h2>
              <p className="text-xl text-gray-600">
                {t("contact.description")}
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-900">Hotline</div>
                  <div className="text-gray-600">1900 1234 ({t("contact.free")})</div>
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
                  <div className="text-gray-900">{t("contact.address")}</div>
                  <div className="text-gray-600">{t("contact.address1")}</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-gray-900">{t("contact.followUs")}</h4>
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
        </div>
      </div>
    </section>
  );
}