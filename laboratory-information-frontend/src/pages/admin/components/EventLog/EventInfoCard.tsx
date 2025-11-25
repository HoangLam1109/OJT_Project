import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/card';
import { Label } from '@/components/common/label';
import { Hash } from 'lucide-react';
import type { EventLog } from '@/service/eventLogService';

interface EventInfoCardProps {
  log: EventLog;
}

export const EventInfoCard: React.FC<EventInfoCardProps> = ({ log }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Hash className="w-5 h-5 mr-2" />
          Thông tin sự kiện
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm text-gray-600">Mã sự kiện</Label>
            <p className="text-lg font-semibold mt-1">{log.event_code || '-'}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Chức năng</Label>
            <p className="text-lg mt-1">{log.service_name || '-'}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Hành động</Label>
            <p className="text-lg mt-1">{log.action || '-'}</p>
          </div>
          <div className="md:col-span-2">
            <Label className="text-sm text-gray-600">Nội dung</Label>
            <p className="text-lg mt-1">{log.event_message || '-'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
