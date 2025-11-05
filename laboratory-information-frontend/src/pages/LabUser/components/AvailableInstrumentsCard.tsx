import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/common/card';
import Badge from '../../../components/common/badge';
import { Progress } from '../../../components/common/progress';
import { Monitor } from 'lucide-react';
import type { Instrument } from '../../../service/types/Instrument';
import { Skeleton } from '@/components/common/skeleton';

interface AvailableInstrumentsCardProps {
  instruments: Instrument[];
  loading?: boolean;
}

const AvailableInstrumentsCard: React.FC<AvailableInstrumentsCardProps> = ({ instruments,loading }) => {
    if (loading) {
    return (
      <Card className="glass-strong hover-lift">
        <CardHeader>
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg bg-white/50 space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="glass-strong hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          Thiết bị Khả dụng ({instruments.length})
        </CardTitle>
        <CardDescription>
          Danh sách thiết bị sẵn sàng thực hiện xét nghiệm
        </CardDescription>
      </CardHeader>
      <CardContent>
        {instruments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {instruments.map((instrument) => (
              <div key={instrument.id} className="p-4 border rounded-lg bg-white/50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-green-600" />
                    {instrument.name}
                  </h4>
                  <Badge variant="default" className="bg-green-600">Sẵn sàng</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model:</span>
                    <span>{instrument.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vị trí:</span>
                    <span>{instrument.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hiệu suất:</span>
                    <span>{instrument.throughputPerHour} test/h</span>
                  </div>
                  {instrument.reagentLevel !== undefined && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Hóa chất:</span>
                        <span>{instrument.reagentLevel}%</span>
                      </div>
                      <Progress value={instrument.reagentLevel} className="h-1.5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Monitor className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>Không có thiết bị khả dụng</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableInstrumentsCard;

