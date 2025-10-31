import React from 'react';
import Badge from '../../../components/common/badge';
import { Clock, PlayCircle, CheckCircle, XCircle } from 'lucide-react';
import type { TestOrder } from '../types/TestOrderTypes';

export const getPriorityBadge = (priority: string): React.JSX.Element => {
  switch (priority) {
    case 'Emergency':
    case 'Urgent':
    case 'urgent':
      return <Badge variant="destructive">Khẩn cấp</Badge>;
    case 'Normal':
    case 'normal':
      return <Badge variant="default">Bình thường</Badge>;
    case 'Routine':
    case 'routine':
      return <Badge variant="secondary">Thường quy</Badge>;
    default:
      return <Badge variant="default">{priority}</Badge>;
  }
};

export const getStatusBadge = (status: string): React.JSX.Element => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'pending':
      return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Chờ xử lý</Badge>;
    case 'processing':
      return <Badge variant="default"><PlayCircle className="w-3 h-3 mr-1" />Đang xử lý</Badge>;
    case 'completed':
      return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Hoàn thành</Badge>;
    case 'cancelled':
    case 'failed':
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Thất bại</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const calculateStats = (orders: TestOrder[]) => {
  return {
    pending: orders.filter(o => o.status === 'Pending' || o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'Processing' || o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'Completed' || o.status === 'completed').length,
    failed: orders.filter(o => o.status === 'Cancelled' || o.status === 'failed').length,
  };
};

export const filterTestOrders = (
  orders: TestOrder[],
  searchTerm: string,
  statusFilter: string
): TestOrder[] => {
  let filtered = orders;

  if (searchTerm) {
    filtered = filtered.filter(order =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.testName && order.testName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  if (statusFilter !== 'All') {
    filtered = filtered.filter(order => order.status === statusFilter);
  }

  return filtered;
};

