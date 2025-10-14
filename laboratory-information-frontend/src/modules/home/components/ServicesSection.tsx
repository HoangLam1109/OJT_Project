import { Card, CardContent } from '../../../components/common/card'

import { 
  TestTube2,
  Heart,
  Database,
  Eye,
  CheckCircle
} from 'lucide-react';

export function ServicesSection() {
  const services = [
    {
      icon: <TestTube2 className="h-12 w-12 text-blue-600" />,
      title: "Xét nghiệm máu",
      description: "Xét nghiệm sinh hóa, huyết học, miễn dịch với độ chính xác cao",
      features: ["CBC đầy đủ", "Sinh hóa 12 thông số", "Marker ung thư", "Hormone"]
    },
    {
      icon: <Heart className="h-12 w-12 text-red-600" />,
      title: "Xét nghiệm tim mạch",
      description: "Đánh giá sức khỏe tim mạch với các marker chuyên biệt",
      features: ["Troponin I/T", "CK-MB", "BNP/NT-proBNP", "Lipid profile"]
    },
    {
      icon: <Database className="h-12 w-12 text-green-600" />,
      title: "Xét nghiệm vi sinh",
      description: "Chẩn đoán nhiễm khuẩn, virus với công nghệ PCR hiện đại",
      features: ["Cấy khuẩn", "Kháng sinh đồ", "PCR virus", "Nấm học"]
    },
    {
      icon: <Eye className="h-12 w-12 text-purple-600" />,
      title: "Xét nghiệm mô bệnh học",
      description: "Chẩn đoán bệnh lý qua mẫu mô với độ chính xác tuyệt đối",
      features: ["Sinh thiết", "Tế bào học", "Miễn dịch mô", "Phân tử học"]
    }
  ];

  return (
    <section className="px-6 py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-gray-900 mb-4">
            Dịch vụ <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">xét nghiệm</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hỗ trợ đầy đủ các loại xét nghiệm với quy trình chuẩn hóa và báo cáo chi tiết
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                  </div>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
