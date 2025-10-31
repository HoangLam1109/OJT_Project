import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/common/card';
import Button from '../../../components/common/button';
import { Progress } from '../../../components/common/progress';
import { TestTube, PlayCircle, Pause, CheckCircle } from 'lucide-react';
import type { TestOrder } from '../types/TestOrderTypes';
import { getPriorityBadge, getStatusBadge } from '../utils/testOrderUtils';

interface TestOrderListProps {
  orders: TestOrder[];
  onOrderClick: (order: TestOrder) => void;
  onStartTest: (order: TestOrder) => void;
  onPauseTest: (orderId: string) => void;
  onCompleteTest: (orderId: string) => void;
}

const TestOrderList: React.FC<TestOrderListProps> = ({
  orders,
  onOrderClick,
  onStartTest,
  onPauseTest,
  onCompleteTest,
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
                      {getPriorityBadge(order.priority)}
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <p>Bệnh nhân: <span className="text-gray-900">{order.patientName}</span></p>
                      <p>Loại xét nghiệm: <span className="text-gray-900">{order.testType}</span></p>
                      {order.assignedInstrument && (
                        <>
                          <p>Thiết bị: <span className="text-gray-900">{order.assignedInstrument}</span></p>
                          <p>Bắt đầu: <span className="text-gray-900">{order.startTime}</span></p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(order.status === 'Pending' || order.status === 'pending') && (
                      <Button 
                        size="sm"
                        className="flex items-center gap-2 px-3 py-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartTest(order);
                        }}
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Bắt đầu</span>
                      </Button>
                    )}
                    {(order.status === 'Processing' || order.status === 'processing') && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center gap-2 px-3 py-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPauseTest(order.id);
                          }}
                        >
                          <Pause className="w-4 h-4" />
                          <span>Tạm dừng</span>
                        </Button>
                        <Button 
                          size="sm"
                          className="flex items-center gap-2 px-3 py-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCompleteTest(order.id);
                          }}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Hoàn thành</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {(order.status === 'Processing' || order.status === 'processing') && order.progress !== undefined && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Tiến độ</span>
                      <span className="text-blue-600">{order.progress}%</span>
                    </div>
                    <Progress value={order.progress} className="h-2" />
                    {order.estimatedCompletion && (
                      <p className="text-xs text-gray-500 mt-1">
                        Dự kiến hoàn thành: {order.estimatedCompletion}
                      </p>
                    )}
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

