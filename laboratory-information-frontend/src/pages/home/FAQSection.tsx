import { Card, CardContent } from '../../components/common/card'
import { HelpCircle } from 'lucide-react';

export function FAQSection() {
  const faqs = [
    {
      question: "LIMS Pro có phù hợp với phòng lab nhỏ không?",
      answer: "Có, LIMS Pro được thiết kế đặc biệt cho phòng lab đơn lẻ với quy mô từ nhỏ đến vừa. Hệ thống có thể mở rộng theo nhu cầu phát triển."
    },
    {
      question: "Có cần đào tạo nhân viên sử dụng hệ thống không?",
      answer: "LIMS Pro có giao diện trực quan và dễ sử dụng. Chúng tôi cung cấp khóa đào tạo cơ bản và hỗ trợ 24/7 trong giai đoạn triển khai."
    },
    {
      question: "Dữ liệu có được bảo mật an toàn không?",
      answer: "Tuyệt đối! Chúng tôi sử dụng mã hóa end-to-end, backup tự động và tuân thủ đầy đủ các tiêu chuẩn bảo mật y tế quốc tế."
    },
    {
      question: "Chi phí triển khai hệ thống như thế nào?",
      answer: "Chúng tôi có các gói dịch vụ linh hoạt phù hợp với mọi quy mô. Liên hệ để được tư vấn chi tiết và báo giá cụ thể."
    }
  ];

  return (
    <section className="px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-gray-900 mb-4">
            Câu hỏi <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">thường gặp</span>
          </h2>
          <p className="text-xl text-gray-600">
            Giải đáp những thắc mắc phổ biến về hệ thống LIMS Pro
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-gray-900">{faq.question}</h4>
                    <p className="text-gray-600">{faq.answer}</p>
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
