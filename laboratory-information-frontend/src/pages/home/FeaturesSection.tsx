import { Card, CardContent } from '../../components/common/card'
import { 
  TestTube2,
  Users,
  BarChart3,
  Database,
  Shield,
  Settings
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <TestTube2 className="h-8 w-8 text-blue-600" />,
      title: "Quản lý mẫu xét nghiệm",
      description: "Theo dõi mẫu bằng mã vạch, quản lý quy trình xét nghiệm từ A-Z"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Quản lý bệnh nhân",
      description: "Đăng ký bệnh nhân với ID duy nhất, lưu trữ thông tin chi tiết"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Báo cáo & Phân tích",
      description: "Dashboard thông minh với báo cáo tài chính và phân tích dữ liệu"
    },
    {
      icon: <Database className="h-8 w-8 text-orange-600" />,
      title: "Quản lý tồn kho",
      description: "Theo dõi hóa chất, thiết bị với cảnh báo tự động"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Bảo mật cao",
      description: "Kiểm soát truy cập dựa trên vai trò, mã hóa dữ liệu"
    },
    {
      icon: <Settings className="h-8 w-8 text-indigo-600" />,
      title: "Tự động hóa",
      description: "Nhắc nhở, cảnh báo và ghi log kiểm toán tự động"
    }
  ];

  return (
    <section className="px-6 py-20 bg-white/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-gray-900 mb-4">
            Tính năng <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">nổi bật</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hệ thống LIMS toàn diện với đầy đủ tính năng cần thiết cho việc quản lý phòng thí nghiệm hiện đại
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
