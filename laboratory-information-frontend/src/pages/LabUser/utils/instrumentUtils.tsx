import React from 'react';
import type { Instrument } from '../data/mockInstrumentsData';

export const getStatusBadge = (status: string): React.JSX.Element => {
  const statusClasses = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-gray-100 text-gray-800',
    Maintenance: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
      {status}
    </span>
  );
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

export const filterInstruments = (
  instruments: Instrument[],
  searchTerm: string,
  statusFilter: string
): Instrument[] => {
  let filtered = instruments;

  if (searchTerm) {
    filtered = filtered.filter(
      (instrument) =>
        instrument.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instrument.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instrument.serial.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (statusFilter !== 'All') {
    filtered = filtered.filter((instrument) => instrument.status === statusFilter);
  }

  return filtered;
};

