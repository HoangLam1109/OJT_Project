import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/common/card';
import Button from '../../../../components/common/button';
import { Progress } from '../../../../components/common/progress';
import { TestTube, PlayCircle, Pause, CheckCircle } from 'lucide-react';
import type { TestOrder } from '../../types/TestOrderTypes';
import { getStatusBadge, translateTestType } from '../../utils/testOrderUtils';
import Pagination from '../../../../components/common/pagination';
import { useTranslation } from 'react-i18next';
interface TestOrderListProps {
  orders: TestOrder[];
  onOrderClick: (order: TestOrder) => void;
  onStatusChange: (orderId: string, newStatus: 'Pending' | 'Processing' | 'Completed') => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

const TestOrderList: React.FC<TestOrderListProps> = ({
  orders,
  onOrderClick,
  onStatusChange,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false
}) => {

  const {t} = useTranslation();
  return (
    <Card className="glass-strong hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          {t('testOrder.testOrderList')}
          {isLoading && (
            <span className="ml-2 text-sm text-gray-500 animate-pulse">{t('testOrder.loading')}</span>
          )}
        </CardTitle>
        <CardDescription>
          {t('testOrder.subTestOrderList')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors cursor-pointer"
                onClick={() => onOrderClick(order)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-mono">{order.barcode || order._id}</h4>

                      {getStatusBadge(order.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <p>{t('testOrder.patient')}: <span className="text-gray-900">{order.patient_name}</span></p>
                      <p>{t('testOrder.testType')}: <span className="text-gray-900">{translateTestType(order.test_type, t)}</span></p>
                      <p>{t('testOrder.deadline')}: <span className="text-gray-900">{order.due_date}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.status.toLowerCase() === 'pending' && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(order._id, 'Processing');
                        }}
                      >
                        <PlayCircle className="w-4 h-4" />
                        {t('testOrder.start')}
                      </Button>
                    )}
                    {order.status.toLowerCase() === 'processing' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(order._id, 'Pending');
                          }}
                        >
                          <Pause className="w-4 h-4" />
                          {t('testOrder.stop')}
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(order._id, 'Completed');
                          }}
                        > 
                          <CheckCircle className="w-4 h-4" />
                          {t('testOrder.complete')}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {order.status.toLowerCase() === "processing" && order.processing !== undefined && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">{t('testOrder.progress')}</span>
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
            <p>{t('testOrder.nothing')}</p>
          </div>
        )}
        
        {/* Pagination */}
        {currentPage !== undefined && totalPages !== undefined && onPageChange && totalPages > 0 && (
          <div className="mt-6 pt-4 border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestOrderList;

