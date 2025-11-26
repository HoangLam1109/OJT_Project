import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/card';
import { Label } from '@/components/common/label';
import { Clock } from 'lucide-react';
import type { EventLog } from '@/service/eventLogService';
import { OperatorInfoCard } from './components/EventLog/OperatorInfoCard';
import { EventInfoCard } from './components/EventLog/EventInfoCard';
import { useTranslation } from 'react-i18next';

interface EventLogTestOrderDetailPageProps {
  log: EventLog;
}

interface ReagentUsage {
  reagent_name?: string;
  quantity_used?: number;
}

interface TestOrderSnapshot {
  patient_name?: string;
  test_type?: string;
  instrument_name?: string;
  reagent_usages?: ReagentUsage[];
  test_item_names?: string[];
  status?: string;
  due_date?: string;
  notes?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  snapshot?: any; 
}

export const EventLogTestOrderDetailPage: React.FC<EventLogTestOrderDetailPageProps> = ({ log }) => {
  const { t } = useTranslation();

  const formatDateOnly = (iso?: string) => {
    if (!iso) return '-';
    try {
      const date = new Date(iso);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalizeData = (data: any): TestOrderSnapshot | null => {
    if (!data) return null;
    
    let source = data;
    if (data.snapshot && !data.patient_name) {
        if (data.snapshot.test_order) {
             source = data.snapshot.test_order;
        } else {
             source = data.snapshot;
        }
    }

    return {
      patient_name: source.patient_name,
      test_type: source.test_type,
      instrument_name: source.instrument_name,
      reagent_usages: source.reagent_usages,
      test_item_names: source.test_item_names,
      status: source.status,
      due_date: source.due_date,
      notes: source.notes,
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTestOrderInfo = (data: any, title: string) => {
    const snapshot = normalizeData(data);
    if (!snapshot) return null;

    return (
      <div className="space-y-4">
        {title && <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">{title}</h3>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {snapshot.patient_name && (
            <div>
              <p className="text-gray-500">{t('eventLog.testOrder.patientName')}</p>
              <p className="font-medium">{snapshot.patient_name}</p>
            </div>
          )}
          {snapshot.test_type && (
            <div>
              <p className="text-gray-500">{t('eventLog.testOrder.testType')}</p>
              <p className="font-medium">{snapshot.test_type}</p>
            </div>
          )}
          {snapshot.instrument_name && (
            <div>
              <p className="text-gray-500">{t('eventLog.testOrder.instrumentName')}</p>
              <p className="font-medium">{snapshot.instrument_name}</p>
            </div>
          )}
           {snapshot.reagent_usages && snapshot.reagent_usages.length > 0 && (
            <div>
              <p className="text-gray-500">{t('eventLog.testOrder.reagentName')}</p>
              <div className="flex flex-wrap gap-1">
                {snapshot.reagent_usages.map((r, idx) => (
                    <span key={idx} className="font-medium">
                        {r.reagent_name}{idx < (snapshot.reagent_usages?.length || 0) - 1 ? ', ' : ''}
                    </span>
                ))}
              </div>
            </div>
          )}
          {snapshot.test_item_names && snapshot.test_item_names.length > 0 && (
            <div>
              <p className="text-gray-500">{t('eventLog.testOrder.testItemName')}</p>
               <p className="font-medium">{snapshot.test_item_names.join(', ')}</p>
            </div>
          )}
          {snapshot.status && (
            <div>
              <p className="text-gray-500">{t('eventLog.testOrder.status')}</p>
              <p className="font-medium">{t(`status.${snapshot.status}`, { defaultValue: snapshot.status })}</p>
            </div>
          )}
          {snapshot.due_date && (
            <div>
              <p className="text-gray-500">{t('eventLog.testOrder.dueDate')}</p>
              <p className="font-medium">{formatDateOnly(snapshot.due_date)}</p>
            </div>
          )}
           {snapshot.notes && (
            <div className="md:col-span-2">
              <p className="text-gray-500">{t('eventLog.testOrder.notes')}</p>
              <p className="font-medium">{snapshot.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEventContent = () => {
    const action = String(log.action ?? '').toUpperCase();
    
    if (action === 'CREATE') {
      return renderTestOrderInfo(log.new_values, t('eventLog.testOrder.createdOrder'));
    } else if (action === 'DELETE') {
      return renderTestOrderInfo(log.old_values, t('eventLog.testOrder.deletedOrder'));
    } else if (action === 'UPDATE') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-r pr-4">
              <h3 className="font-semibold text-lg text-gray-900 border-b pb-2 mb-4">{t('eventLog.iam.oldData')}</h3>
              {renderTestOrderInfo(log.old_values, '')}
            </div>
            <div className="pl-4">
              <h3 className="font-semibold text-lg text-gray-900 border-b pb-2 mb-4">{t('eventLog.iam.newData')}</h3>
              {renderTestOrderInfo(log.new_values, '')}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gray-600">{t('eventLog.oldValue')}</Label>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-64 mt-1">
            {log.old_values ? JSON.stringify(log.old_values, null, 2) : t('eventLog.empty')}
          </pre>
        </div>
        <div>
          <Label className="text-sm text-gray-600">{t('eventLog.newValue')}</Label>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-64 mt-1">
            {log.new_values ? JSON.stringify(log.new_values, null, 2) : t('eventLog.empty')}
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
            {t('eventLog.changedData')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderEventContent()}
        </CardContent>
      </Card>
    </div>
  );
};
