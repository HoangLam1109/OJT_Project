import { Card, CardContent } from '../../../components/common/card'
import Button from '../../../components/common/button';
import { ArrowRight } from 'lucide-react';
import type { LoginType } from '../../../types';

export function CTASection({ onShowLogin }: LoginType) {
  return (
    <section className="px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-2xl">
          <CardContent className="p-12">
            <div className="space-y-6">
              <h2 className="text-4xl text-white">
                Sẵn sàng bắt đầu?
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Trải nghiệm hệ thống LIMS hiện đại với giao diện thân thiện và tính năng mạnh mẽ
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={onShowLogin}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Đăng nhập ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/10 transition-all duration-200"
                >
                  Liên hệ hỗ trợ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
