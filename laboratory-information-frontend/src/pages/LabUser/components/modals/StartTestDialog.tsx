import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/common/dialog';
import { Label } from '../../../../components/common/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/common/select';
import Button from '../../../../components/common/button';
import { PlayCircle, Monitor, AlertCircle } from 'lucide-react';
import type { TestOrder } from '../../types/TestOrderTypes';
import type { Instrument } from '../../../../service/types/Instrument';
import { getPriorityBadge } from '../../utils/testOrderUtils';

interface StartTestDialogProps {
  isOpen: boolean;
  order: TestOrder | null;
  availableInstruments: Instrument[];
  selectedInstrument: string;
  onClose: () => void;
  onInstrumentChange: (instrumentId: string) => void;
  onConfirm: () => void;
}

const StartTestDialog: React.FC<StartTestDialogProps> = ({
  isOpen,
  order,
  availableInstruments,
  selectedInstrument,
  onClose,
  onInstrumentChange,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bắt đầu Xét nghiệm</DialogTitle>
          <DialogDescription>
            Chọn thiết bị để thực hiện xét nghiệm
          </DialogDescription>
        </DialogHeader>

        {order && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mã mẫu:</span>
                <span className="font-mono">{order.barcode || order.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bệnh nhân:</span>
                <span>{order.patientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Loại xét nghiệm:</span>
                <span>{order.testType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ưu tiên:</span>
                {getPriorityBadge(order.priority)}
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="instrument" className="mb-2 text-sm font-medium">Chọn thiết bị *</Label>
              <Select value={selectedInstrument} onValueChange={onInstrumentChange}>
                <SelectTrigger 
                  id="instrument"
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-left h-auto min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
                >
                  <SelectValue placeholder="Chọn thiết bị..." className="text-gray-700" />
                </SelectTrigger>
                <SelectContent className="w-full max-h-[300px] overflow-y-auto bg-white border-2 border-gray-200 rounded-lg shadow-lg mt-1">
                  {availableInstruments.length > 0 ? (
                    availableInstruments.map((instrument) => {
                      const isCompatible = order.testType && order.testType !== 'Chưa xác định' 
                        ? instrument.testTypes?.includes(order.testType) 
                        : true;
                      
                      return (
                        <SelectItem 
                          key={instrument.id} 
                          value={instrument.id} 
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer focus:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <Monitor className={`w-4 h-4 flex-shrink-0 ${isCompatible ? 'text-green-600' : 'text-gray-400'}`} />
                            <span className="font-medium text-sm text-gray-900">{instrument.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })
                  ) : (
                    <div className="px-3 py-4 text-center text-sm text-gray-500">
                      Không có thiết bị khả dụng
                    </div>
                  )}
                </SelectContent>
              </Select>
              {availableInstruments.length === 0 && (
                <p className="text-xs text-red-600 mt-1.5">
                  Không có thiết bị khả dụng. Vui lòng kiểm tra lại sau.
                </p>
              )}
              {availableInstruments.length > 0 && order.testType && order.testType !== 'Chưa xác định' && 
                availableInstruments.filter(i => i.testTypes?.includes(order.testType)).length === 0 && (
                <p className="text-xs text-yellow-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Không có thiết bị nào hỗ trợ loại xét nghiệm "{order.testType}". Vui lòng chọn thiết bị thủ công.</span>
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="flex items-center justify-end gap-3 sm:gap-2 pt-4 mt-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-6"
          >
            Hủy
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={!selectedInstrument}
            className="px-6"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Bắt đầu xét nghiệm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StartTestDialog;

