import { Card, CardContent } from '../common/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Star, Quote } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "BS. Nguyễn Thị Minh",
      role: "Giám đốc Phòng Lab Bệnh viện Đa khoa ABC",
      content: "LIMS Pro đã giúp chúng tôi nâng cao hiệu quả công việc lên 300%. Giao diện thân thiện và tính năng đầy đủ.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1655814563963-0fe0a7d6c279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwc2NpZW50aXN0JTIwd29tYW58ZW58MXx8fHwxNzU5NDgzNjEyfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "TS. Trần Văn Hùng",
      role: "Trưởng khoa Xét nghiệm Bệnh viện XYZ",
      content: "Hệ thống theo dõi mẫu bằng mã vạch rất hiệu quả, giảm thiểu sai sót và tiết kiệm thời gian đáng kể.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nfGVufDF8fHx8MTc1OTM3MzY0Mnww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "ThS. Lê Thị Hoa",
      role: "Kỹ thuật viên Lab Phòng khám DEF",
      content: "Báo cáo tài chính và quản lý tồn kho tự động giúp chúng tôi tiết kiệm rất nhiều thời gian và chi phí.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1655814563963-0fe0a7d6c279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwc2NpZW50aXN0JTIwd29tYW58ZW58MXx8fHwxNzU5NDgzNjEyfDA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  return (
    <section className="px-6 py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-gray-900 mb-4">
            Khách hàng <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">nói gì</span>
          </h2>
          <p className="text-xl text-gray-600">
            Hàng trăm phòng thí nghiệm đã tin tưởng và sử dụng LIMS Pro
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 italic">
                    <Quote className="h-6 w-6 text-gray-400 mb-2" />
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
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
