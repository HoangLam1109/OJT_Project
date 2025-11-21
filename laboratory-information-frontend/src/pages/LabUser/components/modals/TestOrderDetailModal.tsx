import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/common/dialog';
import Button from '../../../../components/common/button';
import Badge from '../../../../components/common/badge';
import { Clock, User, TestTube, Microscope, FlaskConical, List } from 'lucide-react';
import type { TestOrder } from '../../types/TestOrderTypes';
import { testItemService, type TestItem } from '../../../../service/testItemService';
import { useTranslation } from 'react-i18next';

interface TestOrderDetailModalProps {
  order: TestOrder | null;
  isOpen: boolean;
  onDelete?: (order: TestOrder) => void; 
  onEdit?: (order: TestOrder) => void; 
  onClose: () => void;
}

const TestOrderDetailModal: React.FC<TestOrderDetailModalProps> = ({
  order,
  isOpen,
  onDelete,
  onEdit,
  onClose,
}) => {
  const { t } = useTranslation();
  const [testItems, setTestItems] = useState<TestItem[]>([]);
  const [loadingTestItems, setLoadingTestItems] = useState(false);

  useEffect(() => {
    const loadTestItems = async () => {
      if (!order?.test_item_ids || order.test_item_ids.length === 0) {
        setTestItems([]);
        return;
      }

      try {
        setLoadingTestItems(true);
        const items = await Promise.all(
          order.test_item_ids.map(id => testItemService.getTestItemById(id))
        );
        setTestItems(items.filter((item): item is TestItem => item !== null));
      } catch (error) {
        console.error('Error loading test items:', error);
        setTestItems([]);
      } finally {
        setLoadingTestItems(false);
      }
    };

    if (isOpen && order) {
      loadTestItems();
    }
  }, [isOpen, order]);

  if (!order) return null;

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />{t('testOrder.detail.pending')}</Badge>;
      case 'processing':
        return <Badge variant="default"><TestTube className="w-3 h-3 mr-1" />{t('testOrder.detail.processing')}</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600"><TestTube className="w-3 h-3 mr-1" />{t('testOrder.detail.completed')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            {t('testOrder.detail.title')}
          </DialogTitle>
          <DialogDescription>
            {t('testOrder.detail.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-3 border-b">
              <div>
                <h3 className="font-mono text-lg font-semibold">{order.barcode || order._id}</h3>
              </div>
              {getStatusBadge(order.status)}
            </div>

            {/* Patient Information */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                {t('testOrder.detail.patientInfo')}
              </h4>
              <div className="grid grid-cols-2 gap-3 pl-6">
                <div>
                  <span className="text-sm text-gray-600">{t('testOrder.detail.patientName')}</span>
                  <p className="font-medium">{order.patient_name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">{t('testOrder.detail.patientCode')}</span>
                  <p className="font-mono text-sm">{order.patient_id}</p>
                </div>
              </div>
            </div>

            {/* Test Information */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                {t('testOrder.detail.testInfo')}
              </h4>
              <div className="grid grid-cols-2 gap-3 pl-6">
                <div>
                  <span className="text-sm text-gray-600">{t('testOrder.detail.testType')}</span>
                  <p className="font-medium">{order.test_type}</p>
                </div>
                {order.created_at && (
                  <div>
                    <span className="text-sm text-gray-600">{t('testOrder.detail.sampleDate')}</span>
                    <p className="font-medium">{order.created_at}</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-3 pl-6">
                <div>
                  <span className="text-sm text-gray-600">{t('testOrder.detail.dueDate')}</span>
                  <p className="font-medium">{order.due_date}</p>
                </div>
              </div>
            </div>

            {/* Test Items Information */}
            {order.test_item_ids && order.test_item_ids.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <List className="w-4 h-4" />
                  {t('testOrder.detail.testItems')}
                </h4>
                <div className="pl-6">
                  {loadingTestItems ? (
                    <p className="text-sm text-gray-500">{t('testOrder.detail.loading')}</p>
                  ) : testItems.length > 0 ? (
                    <div className="space-y-2">
                      {testItems.map((item) => (
                        <div key={item._id} className="bg-gray-50 p-3 rounded-lg border">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-sm text-gray-600">{t('testOrder.detail.testItemName')}</span>
                              <p className="font-medium">{item.name}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">{t('testOrder.detail.code')}</span>
                              <p className="font-mono text-sm">{item.code}</p>
                            </div>
                            {item.unit && (
                              <div>
                                <span className="text-sm text-gray-600">{t('testOrder.detail.unit')}</span>
                                <p className="font-medium">{item.unit}</p>
                              </div>
                            )}
                            {(item.ref_min !== undefined || item.ref_max !== undefined) && (
                              <div>
                                <span className="text-sm text-gray-600">{t('testOrder.detail.referenceValue')}</span>
                                <p className="font-medium">
                                  {item.ref_min !== undefined && item.ref_max !== undefined
                                    ? `${item.ref_min} - ${item.ref_max}`
                                    : item.ref_min !== undefined
                                    ? `≥ ${item.ref_min}`
                                    : `≤ ${item.ref_max}`}
                                </p>
                              </div>
                            )}
                            {item.method && (
                              <div className="col-span-2">
                                <span className="text-sm text-gray-600">{t('testOrder.detail.method')}</span>
                                <p className="font-medium">{item.method}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">{t('testOrder.detail.noTestItems')}</p>
                  )}
                </div>
              </div>
            )}

            {/* Instrument Information */}
            {order.instrument && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <Microscope className="w-4 h-4" />
                  {t('testOrder.detail.instrumentInfo')}
                </h4>
                <div className="grid grid-cols-2 gap-3 pl-6">
                  <div>
                    <span className="text-sm text-gray-600">{t('testOrder.detail.instrumentCode')}</span>
                    <p className="font-mono text-sm">{order.instrument.instrument_code}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t('testOrder.detail.instrumentName')}</span>
                    <p className="font-medium">{order.instrument.instrument_name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t('testOrder.detail.instrumentType')}</span>
                    <p className="font-medium">{order.instrument.instrument_type}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t('testOrder.detail.manufacturer')}</span>
                    <p className="font-medium">{order.instrument.manufacturer}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t('testOrder.status')}</span>
                    <Badge variant={order.instrument.status === 'Ready' ? 'default' : 'secondary'} className="mt-1">
                      {order.instrument.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Reagents Information */}
            {order.reagents && order.reagents.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4" />
                  {t('testOrder.detail.reagentInfo')}
                </h4>
                <div className="pl-6">
                  <div className="space-y-2">
                    {order.reagents.map((reagent, index) => (
                      <div key={reagent.reagent_id || index} className="bg-gray-50 p-3 rounded-lg border">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-sm text-gray-600">{t('testOrder.detail.reagentName')}</span>
                            <p className="font-medium">{reagent.reagent_name}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">{t('testOrder.detail.reagentType')}</span>
                            <p className="font-medium">{reagent.reagent_type}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">{t('testOrder.detail.quantityUsed')}</span>
                            <p className="font-medium">{reagent.quantity_used}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">{t('testOrder.status')}</span>
                            <Badge variant={reagent.status === 'Available' ? 'default' : 'secondary'} className="mt-1">
                              {reagent.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">{t('testOrder.detail.notes')}</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {order.notes?.trim() ? order.notes : t('testOrder.detail.noNotes')}
              </p>
            </div>


          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-3 sm:gap-2 pt-4 mt-2">

          {/* Nút cập nhật */}
          {onEdit && (
            <Button
              variant="default"
              onClick={() => {
                onEdit(order);
                onClose();
              }}
              className="px-6"
            >
              {t('testOrder.detail.update')}
            </Button>
          )}

          {/* Nút xóa */}
          {onDelete && (
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(order);
                onClose();
              }}
              className="px-6"
            >
              {t('testOrder.detail.delete')}
            </Button>
          )}
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default TestOrderDetailModal;

