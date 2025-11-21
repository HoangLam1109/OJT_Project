import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/common/button';
import { ArrowLeft, ArrowRight, Check, Search, X } from 'lucide-react';
import type { Reagent } from './data/mockReagentsData';
import { testOrderService } from '../../service/testOrderService';
import { reagentService } from '../../service/reagentService';
import { useAuthContext } from '../../hooks/useAuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '../../components/common/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/table';
import { Input } from '../../components/common/input';
import Pagination from '../../components/common/pagination';
import { useTranslation } from 'react-i18next';

interface SelectedReagent {
  reagentId: string;
  quantity: number;
}

interface LocationState {
  formData: any;
  instruments: any[];
}

const SelectReagentsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const state = location.state as LocationState | null;

  // Detect current route base path (service, labuser, or admin)
  const getBasePath = () => {
    if (location.pathname.startsWith('/service')) {
      return '/service';
    }
    if (location.pathname.startsWith('/admin')) {
      return '/admin';
    }
    return '/labuser';
  };

  const [baseReagents, setBaseReagents] = useState<Reagent[]>([]);
  const [reagents, setReagents] = useState<Reagent[]>([]);
  const [selectedReagents, setSelectedReagents] = useState<Record<string, SelectedReagent>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Available quantity for each reagent (using reagent.quantity)
  const availableQuantities = useMemo(() => {
    const initial: Record<string, number> = {};
    [...baseReagents, ...reagents].forEach(reagent => {
      initial[reagent.id] = reagent.quantity;
    });
    return initial;
  }, [baseReagents, reagents]);

  useEffect(() => {
    if (!state?.formData || !state?.instruments) {
      toast.error(t('testOrder.missingFormData'));
      const basePath = getBasePath();
      navigate(`${basePath}/create-test-order`);
    }
  }, [state, navigate, t]);

  // Fetch reagents from API
  useEffect(() => {
    const fetchReagents = async () => {
      setIsLoading(true);
      try {
        const allReagents = await reagentService.getAllReagents();
        // Filter only Available and Low Stock reagents (exclude Expired and Depleted)
        const availableReagents = allReagents.filter(
          r => r.status === 'Available' || r.status === 'Low Stock'
        );
        setBaseReagents(availableReagents);
        setReagents(availableReagents);
        setTotalItems(availableReagents.length);
        setCurrentPage(1);
      } catch (error: any) {
        console.error('Error fetching reagents:', error);
        toast.error(error.message || t('testOrder.cannotLoadReagents'));
        setBaseReagents([]);
        setReagents([]);
        setTotalItems(0);
        setCurrentPage(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReagents();
  }, []);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setReagents(baseReagents);
      setTotalItems(baseReagents.length);
      setCurrentPage(1);
      setSearchLoading(false);
      return;
    }

    let isCancelled = false;
    setSearchLoading(true);
    const debounceTimer = setTimeout(async () => {
      try {
        const result = await reagentService.searchReagents(trimmedQuery, 1, 20);
        if (isCancelled) return;

        const selectableReagents = result.items.filter(
          reagent => reagent.status === 'Available' || reagent.status === 'Low Stock'
        );
        setReagents(selectableReagents);
        setTotalItems(selectableReagents.length);
        setCurrentPage(1);
      } catch (error: any) {
        if (isCancelled) return;
        console.error('Error searching reagents:', error);
        toast.error(error.message || t('testOrder.cannotSearchReagents'));
      } finally {
        if (!isCancelled) {
          setSearchLoading(false);
        }
      }
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [searchQuery, baseReagents]);

  const handleToggleSelect = (reagentId: string) => {
    setSelectedReagents(prev => {
      const newState = { ...prev };
      if (newState[reagentId]) {
        delete newState[reagentId];
      } else {
        newState[reagentId] = {
          reagentId,
          quantity: 1,
        };
      }
      return newState;
    });
  };

  const handleQuantityChange = (reagentId: string, quantity: number) => {
    const available = availableQuantities[reagentId] || 0;
    const newQuantity = Math.max(1, Math.min(quantity, available));
    
    setSelectedReagents(prev => ({
      ...prev,
      [reagentId]: {
        ...prev[reagentId],
        quantity: newQuantity,
      },
    }));
  };

  const getRemainingQuantity = (reagentId: string): number => {
    const available = availableQuantities[reagentId] || 0;
    const selected = selectedReagents[reagentId];
    if (!selected) return available;
    return Math.max(0, available - selected.quantity);
  };

  const handleSubmit = async () => {
    if (!state?.formData || !state?.instruments) {
      toast.error(t('testOrder.missingFormData'));
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...state.formData,
        created_by: user?.name || 'system',
        updated_by: user?.name ?? 'system',
        instruments: state.instruments,
        reagents: Object.values(selectedReagents),
      };

      await testOrderService.createTestOrder(submitData);
      toast.success(t('testOrder.orderCreatedSuccess'));
      const basePath = getBasePath();
      navigate(`${basePath}/test-orders`);

    } catch (err: any) {
      const msg = err.response?.data?.message || 'Lỗi hệ thống';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get selected reagents with full details
  const selectedReagentsList = useMemo(() => {
    const detailMap = new Map<string, Reagent>();
    baseReagents.forEach(reagent => detailMap.set(reagent.id, reagent));
    reagents.forEach(reagent => detailMap.set(reagent.id, reagent));

    return Object.values(selectedReagents)
      .map((selected) => {
        const reagent = detailMap.get(selected.reagentId);
        return reagent ? { ...reagent, quantity: selected.quantity } : null;
      })
      .filter((item): item is Reagent & { quantity: number } => item !== null);
  }, [selectedReagents, reagents, baseReagents]);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReagents = reagents.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
              <p className="text-base md:text-lg font-bold text-blue-700">{t('testOrder.createOrder')}</p>
              <p className="text-sm md:text-base text-gray-600 hidden md:block mt-1">{t('testOrder.newTestOrder')}</p>
            </div>
          </div>

          {/* Connector 1 - Completed */}
          <div className="flex-1 min-w-[50px] max-w-[100px] h-1.5 bg-gradient-to-r from-blue-600 to-blue-600 rounded-full mt-[-32px]"></div>

          {/* Step 2 - Completed */}
          <div className="flex flex-col items-center gap-4 min-w-[140px]">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-blue-100">
                2
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-base md:text-lg font-bold text-blue-700">{t('testOrder.selectInstrument')}</p>
            </div>
          </div>

          {/* Connector 2 - Completed */}
          <div className="flex-1 min-w-[50px] max-w-[100px] h-1.5 bg-gradient-to-r from-blue-600 to-blue-600 rounded-full mt-[-32px]"></div>

          {/* Step 3 - Active */}
          <div className="flex flex-col items-center gap-4 min-w-[140px]">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-blue-100 animate-pulse">
                3
              </div>
            </div>
            <div className="text-center">
              <p className="text-base md:text-lg font-bold text-blue-700">{t('testOrder.selectReagent')}</p>
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
            onClick={() => {
              const basePath = getBasePath();
              navigate(`${basePath}/select-instruments`, { state });
            }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('testOrder.back')}
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {t('testOrder.selectReagentTitle')}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {t('testOrder.selectReagentDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Reagents Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">{t('testOrder.reagentList')}</h3>
            <div className="flex items-center gap-3 flex-1 justify-end max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('testOrder.searchReagentPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
              {searchQuery && (
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {searchLoading ? t('testOrder.searchingReagents') : t('testOrder.foundReagents', { count: totalItems })}
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
                  <TableHead className="w-12">{t('testOrder.select')}</TableHead>
                  <TableHead>{t('testOrder.reagentName')}</TableHead>
                  <TableHead>{t('testOrder.expiryDate')}</TableHead>
                  <TableHead>{t('testOrder.storageLocation')}</TableHead>
                  <TableHead className="w-32">{t('testOrder.quantity')}</TableHead>
                  <TableHead className="w-32">{t('testOrder.remaining')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading || searchLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-500">
                          {isLoading ? t('testOrder.loadingReagents') : t('testOrder.searchingReagentsLoading')}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedReagents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {t('testOrder.noReagentsFound')}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedReagents.map((reagent) => {
                  const isSelected = !!selectedReagents[reagent.id];
                  const selected = selectedReagents[reagent.id];
                  const remaining = getRemainingQuantity(reagent.id);
                  const available = availableQuantities[reagent.id] || 0;

                  return (
                    <TableRow key={reagent.id}>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(reagent.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </button>
                      </TableCell>
                      <TableCell className="font-medium">
                        {reagent.name}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {reagent.expiryDate}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {reagent.storageLocation || t('testOrder.notUpdated')}
                      </TableCell>
                      <TableCell>
                        {isSelected ? (
                          <input
                            type="number"
                            min="1"
                            max={available}
                            value={selected.quantity}
                            onChange={(e) => handleQuantityChange(reagent.id, parseInt(e.target.value) || 1)}
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="justify-end"
          />
        </CardContent>
      </Card>

      {/* Selected Reagents Panel */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('testOrder.selectedReagents')}</h3>
            {selectedReagentsList.length > 0 && (
              <span className="text-sm text-gray-500 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {selectedReagentsList.length}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {selectedReagentsList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">
                {t('testOrder.noReagentsSelected')}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {t('testOrder.selectReagentsFromList')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedReagentsList.map((reagent) => (
                <div
                  key={reagent.id}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {reagent.name}
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-1">
                      {t('testOrder.expiryDate')}: {reagent.expiryDate} • {reagent.storageLocation || t('testOrder.notUpdated')}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {t('testOrder.quantity')}: <span className="font-semibold text-blue-600">{reagent.quantity}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSelect(reagent.id)}
                    className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                    title={t('testOrder.cancel')}
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
          onClick={() => {
            const basePath = getBasePath();
            navigate(`${basePath}/select-instruments`, { state });
          }}
          disabled={isSubmitting}
          className="px-6 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          {t('testOrder.cancel')}
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('testOrder.creatingOrder') : t('testOrder.createOrderButton')}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SelectReagentsPage;

