import React from 'react';
import Badge from '../../../components/common/badge';
import { Clock, PlayCircle, CheckCircle } from 'lucide-react';
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
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-500">
          <Clock className="w-3 h-3 mr-1" />Chờ xử lý
        </Badge>
      );
    case 'processing':
      return (
        <Badge variant="secondary" className="bg-blue-600 text-white">
          <PlayCircle className="w-3 h-3 mr-1" />Đang xử lý
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="secondary" className="bg-green-600 text-white">
          <CheckCircle className="w-3 h-3 mr-1" />Hoàn thành
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};


export const calculateStats = (orders: TestOrder[]) => {
  return {
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    completed: orders.filter(o => o.status === 'Completed').length,
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
      order.testType.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
  }

  if (statusFilter !== 'All') {
    filtered = filtered.filter(order => order.status === statusFilter);
  }

  return filtered;
};

