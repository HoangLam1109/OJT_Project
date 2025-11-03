import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/common/card';
import Button from '../../../components/common/button';
import { Progress } from '../../../components/common/progress';
import { TestTube, PlayCircle, Pause, CheckCircle } from 'lucide-react';
import type { TestOrder } from '../types/TestOrderTypes';
import { getStatusBadge } from '../utils/testOrderUtils';

interface TestOrderListProps {
  orders: TestOrder[];
  onOrderClick: (order: TestOrder) => void;
  onStatusChange: (orderId: string, newStatus: 'Pending' | 'Processing' | 'Completed') => void;
}

const TestOrderList: React.FC<TestOrderListProps> = ({
  orders,
  onOrderClick,
  onStatusChange
}) => {


  return (
    <Card className="glass-strong hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Danh sách Mẫu
        </CardTitle>
        <CardDescription>
          Quản lý và theo dõi tiến độ xét nghiệm
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors cursor-pointer"
                onClick={() => onOrderClick(order)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-mono">{order.barcode || order.id}</h4>

                      {getStatusBadge(order.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <p>Bệnh nhân: <span className="text-gray-900">{order.patient_name}</span></p>
                      <p>Loại xét nghiệm: <span className="text-gray-900">{order.testType}</span></p>
                      <p>Hạn hoàn thành: <span className="text-gray-900">{order.due_date}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.status === 'Pending' && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(order.id, 'Processing');
                        }}
                      >
                        <PlayCircle className="w-4 h-4" />
                        Bắt đầu
                      </Button>
                    )}
                    {order.status === 'Processing' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(order.id, 'Pending');
                          }}
                        >
                          <Pause className="w-4 h-4" />
                          Tạm dừng
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(order.id, 'Completed');
                          }}
                        > 
                          <CheckCircle className="w-4 h-4" />
                          Hoàn thành
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {order.status?.toLowerCase() === "processing" && order.processing !== undefined && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Tiến độ</span>
                      <span className={order.processing === 100 ? "text-green-600" : "text-blue-600"}>
                        {order.processing}%
                      </span>
                    </div>
                    <Progress value={order.processing} className="h-2" />
                  </div>
                )}



              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Không có mẫu nào</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestOrderList;

