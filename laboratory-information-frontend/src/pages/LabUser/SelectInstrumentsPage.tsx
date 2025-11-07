import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/common/button';
import { ArrowLeft, ArrowRight, Check, Search, X } from 'lucide-react';
import type { Instrument } from '../service/types/Instrument';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '../../components/common/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/table';
import { Input } from '../../components/common/input';
import { instrumentsService } from '../../service/instrumentsService';

interface SelectedInstrument {
  instrumentId: string;
  quantity: number;
}

interface LocationState {
  formData: Record<string, unknown>;
}

const SelectInstrumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInstruments, setSelectedInstruments] = useState<Record<string, SelectedInstrument>>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!state?.formData) {
      toast.error('Thiếu thông tin form');
      navigate('/labuser/create-test-order');
    }
  }, [state, navigate]);

  // Load instruments from API
  useEffect(() => {
    const loadInstruments = async () => {
      setIsLoading(true);
      try {
        const data = await instrumentsService.getAllInstruments();
        setInstruments(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Không thể tải danh sách thiết bị';
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadInstruments();
  }, []);

  const handleToggleSelect = (instrumentId: string) => {
    setSelectedInstruments(prev => {
      const newState = { ...prev };
      if (newState[instrumentId]) {
        delete newState[instrumentId];
      } else {
        newState[instrumentId] = {
          instrumentId,
          quantity: 1,
        };
      }
      return newState;
    });
  };

  // Get available quantity for an instrument (mock: always 5 for now)
  // In real app, this would come from API based on instrumentId
  const getAvailableQuantity = (): number => {
    return 5;
  };

  const handleQuantityChange = (instrumentId: string, quantity: number) => {
    const available = getAvailableQuantity();
    const newQuantity = Math.max(1, Math.min(quantity, available));
    
    setSelectedInstruments(prev => ({
      ...prev,
      [instrumentId]: {
        ...prev[instrumentId],
        quantity: newQuantity,
      },
    }));
  };

  const getRemainingQuantity = (instrumentId: string): number => {
    const available = getAvailableQuantity();
    const selected = selectedInstruments[instrumentId];
    if (!selected) return available;
    return Math.max(0, available - selected.quantity);
  };

  const handleNext = () => {
    if (!state?.formData) {
      toast.error('Thiếu thông tin form');
      return;
    }

    if (Object.keys(selectedInstruments).length === 0) {
      toast.error('Vui lòng chọn ít nhất một thiết bị');
      return;
    }

    // Navigate to select reagents page with form data and selected instruments
    navigate('/labuser/select-reagents', {
      state: {
        formData: state.formData,
        instruments: Object.values(selectedInstruments),
      },
    });
  };

  // Filter instruments based on search query
  const filteredInstruments = useMemo(() => {
    if (!searchQuery.trim()) {
      return instruments;
    }
    const query = searchQuery.toLowerCase().trim();
    return instruments.filter(
      (instrument) =>
        instrument.instrument_name.toLowerCase().includes(query) ||
        instrument.instrument_code.toLowerCase().includes(query) ||
        instrument._id.toLowerCase().includes(query) ||
        instrument.instrument_type.toLowerCase().includes(query)
    );
  }, [instruments, searchQuery]);

  // Get selected instruments with full details
  const selectedInstrumentsList = useMemo(() => {
    return Object.values(selectedInstruments)
      .map((selected) => {
        const instrument = instruments.find((inst) => inst._id === selected.instrumentId);
        return instrument ? { ...instrument, quantity: selected.quantity } : null;
      })
      .filter((item): item is Instrument & { quantity: number } => item !== null);
  }, [selectedInstruments, instruments]);

  return (
    <div className="space-y-6 p-6">
      {/* Step Indicator */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-8">
        <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
          {/* Step 1 - Completed */}
          <div className="flex flex-col items-center gap-4 min-w-[140px]">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-blue-100">
                1
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-base md:text-lg font-bold text-blue-700">Tạo lệnh</p>
              <p className="text-sm md:text-base text-gray-600 hidden md:block mt-1">xét nghiệm mới</p>
            </div>
          </div>

          {/* Connector 1 - Completed */}
          <div className="flex-1 min-w-[50px] max-w-[100px] h-1.5 bg-gradient-to-r from-blue-600 to-blue-600 rounded-full mt-[-32px]"></div>

          {/* Step 2 - Active */}
          <div className="flex flex-col items-center gap-4 min-w-[140px]">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-blue-100 animate-pulse">
                2
              </div>
            </div>
            <div className="text-center">
              <p className="text-base md:text-lg font-bold text-blue-700">Chọn thiết bị</p>
            </div>
          </div>

          {/* Connector 2 - Inactive */}
          <div className="flex-1 min-w-[50px] max-w-[100px] h-1.5 bg-gray-300 rounded-full mt-[-32px]"></div>

          {/* Step 3 - Inactive */}
          <div className="flex flex-col items-center gap-4 min-w-[140px]">
            <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-2xl border-2 border-gray-300">
              3
            </div>
            <div className="text-center">
              <p className="text-base md:text-lg font-semibold text-gray-500">Chọn thuốc thử</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/labuser/create-test-order', { state })}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Chọn thiết bị
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Chọn thiết bị và số lượng để thực hiện xét nghiệm
            </p>
          </div>
        </div>
      </div>

      {/* Instruments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Danh sách thiết bị</h3>
            <div className="flex items-center gap-3 flex-1 justify-end max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên, mã số thiết bị..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
              {searchQuery && (
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  Tìm thấy {filteredInstruments.length} thiết bị
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Chọn</TableHead>
                  <TableHead>Mã số</TableHead>
                  <TableHead>Tên thiết bị</TableHead>
                  <TableHead className="w-32">Số lượng</TableHead>
                  <TableHead className="w-32">Còn lại</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Đang tải danh sách thiết bị...
                    </TableCell>
                  </TableRow>
                ) : filteredInstruments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Không tìm thấy thiết bị nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInstruments.map((instrument) => {
                  const isSelected = !!selectedInstruments[instrument._id];
                  const selected = selectedInstruments[instrument._id];
                  const remaining = getRemainingQuantity(instrument._id);
                  const available = getAvailableQuantity();

                  return (
                    <TableRow key={instrument._id}>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(instrument._id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </button>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {instrument.instrument_code}
                      </TableCell>
                      <TableCell className="font-medium">
                        {instrument.instrument_name}
                      </TableCell>
                      <TableCell>
                        {isSelected ? (
                          <input
                            type="number"
                            min="1"
                            max={available}
                            value={selected.quantity}
                            onChange={(e) => handleQuantityChange(instrument._id, parseInt(e.target.value) || 1)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${remaining === 0 ? 'text-red-600' : remaining < 2 ? 'text-yellow-600' : 'text-gray-700'}`}>
                          {remaining}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">/ {available}</span>
                      </TableCell>
                    </TableRow>
                  );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Selected Instruments Panel */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Thiết bị đã chọn</h3>
            {selectedInstrumentsList.length > 0 && (
              <span className="text-sm text-gray-500 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {selectedInstrumentsList.length}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {selectedInstrumentsList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">
                Chưa có thiết bị nào được chọn
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Chọn thiết bị từ danh sách bên trên
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedInstrumentsList.map((instrument) => (
                <div
                  key={instrument._id}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {instrument.instrument_name}
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-1">
                      {instrument.instrument_code}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Số lượng: <span className="font-semibold text-blue-600">{instrument.quantity}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSelect(instrument._id)}
                    className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                    title="Bỏ chọn"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/labuser/create-test-order', { state })}
          className="px-6 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={Object.keys(selectedInstruments).length === 0}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Tiếp theo
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SelectInstrumentsPage;