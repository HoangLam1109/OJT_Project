import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/card';
import { Label } from '@/components/common/label';
import { Clock } from 'lucide-react';
import type { EventLog } from '@/service/eventLogService';
import { OperatorInfoCard } from './components/EventLog/OperatorInfoCard';
import { EventInfoCard } from './components/EventLog/EventInfoCard';

interface EventLogWarehouseDetailPageProps {
  log: EventLog;
}

interface WarehouseSnapshot {
  instrument_code?: string;
  instrument_name?: string;
  instrument_type?: string;
  manufacturer?: string;
  location?: string;
  status?: string;
  // Snapshot fields from DELETE action
  code?: string;
  name?: string;
  type?: string;
  isActive?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  snapshot?: any; // For nested snapshot in old_values/new_values
}

export const EventLogWarehouseDetailPage: React.FC<EventLogWarehouseDetailPageProps> = ({ log }) => {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalizeData = (data: any): WarehouseSnapshot | null => {
    if (!data) return null;
    
    // If data has snapshot property (like in DELETE old_values), use it
    if (data.snapshot) {
      const snap = data.snapshot;
      return {
        instrument_code: snap.code || snap.instrument_code,
        instrument_name: snap.name || snap.instrument_name,
        instrument_type: snap.type || snap.instrument_type,
        manufacturer: snap.manufacturer,
        location: snap.location,
        status: snap.status,
      };
    }

    // Otherwise use direct properties (like in CREATE new_values)
    return {
      instrument_code: data.instrument_code || data.code,
      instrument_name: data.instrument_name || data.name,
      instrument_type: data.instrument_type || data.type,
      manufacturer: data.manufacturer,
      location: data.location,
      status: data.status,
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderInstrumentInfo = (data: any, title: string) => {
    const snapshot = normalizeData(data);
    if (!snapshot) return null;

    return (
      <div className="space-y-4">
        {title && <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">{title}</h3>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {snapshot.instrument_code && (
            <div>
              <p className="text-gray-500">Mã thiết bị</p>
              <p className="font-medium">{snapshot.instrument_code}</p>
            </div>
          )}
          {snapshot.instrument_name && (
            <div>
              <p className="text-gray-500">Tên thiết bị</p>
              <p className="font-medium">{snapshot.instrument_name}</p>
            </div>
          )}
          {snapshot.instrument_type && (
            <div>
              <p className="text-gray-500">Loại thiết bị</p>
              <p className="font-medium">{snapshot.instrument_type}</p>
            </div>
          )}
          {snapshot.manufacturer && (
            <div>
              <p className="text-gray-500">Nhà sản xuất</p>
              <p className="font-medium">{snapshot.manufacturer}</p>
            </div>
          )}
          {snapshot.location && (
            <div>
              <p className="text-gray-500">Vị trí</p>
              <p className="font-medium">{snapshot.location}</p>
            </div>
          )}
          {snapshot.status && (
            <div>
              <p className="text-gray-500">Trạng thái</p>
              <p className="font-medium">{snapshot.status}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEventContent = () => {
    const action = String(log.action ?? '').toUpperCase();
    
    if (action === 'CREATE') {
      return renderInstrumentInfo(log.new_values, 'Thông tin thiết bị được tạo');
    } else if (action === 'DELETE') {
      return renderInstrumentInfo(log.old_values, 'Thông tin thiết bị đã xóa');
    } else if (action === 'UPDATE') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-r pr-4">
              <h3 className="font-semibold text-lg text-gray-900 border-b pb-2 mb-4">Dữ liệu cũ</h3>
              {renderInstrumentInfo(log.old_values, '')}
            </div>
            <div className="pl-4">
              <h3 className="font-semibold text-lg text-gray-900 border-b pb-2 mb-4">Dữ liệu mới</h3>
              {renderInstrumentInfo(log.new_values, '')}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gray-600">Giá trị cũ</Label>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-64 mt-1">
            {log.old_values ? JSON.stringify(log.old_values, null, 2) : '(trống)'}
          </pre>
        </div>
        <div>
          <Label className="text-sm text-gray-600">Giá trị mới</Label>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-64 mt-1">
            {log.new_values ? JSON.stringify(log.new_values, null, 2) : '(trống)'}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <OperatorInfoCard log={log} />
      <EventInfoCard log={log} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Dữ liệu thay đổi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderEventContent()}
        </CardContent>
      </Card>
    </div>
  );
};
