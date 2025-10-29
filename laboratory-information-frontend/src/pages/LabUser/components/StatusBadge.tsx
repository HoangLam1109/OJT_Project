import React from 'react';
import { Clock, Activity, CheckCircle, X } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    Pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    Processing: { color: 'bg-blue-100 text-blue-800', icon: Activity },
    Completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    Cancelled: { color: 'bg-red-100 text-red-800', icon: X }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </span>
  );
};

export default StatusBadge;

