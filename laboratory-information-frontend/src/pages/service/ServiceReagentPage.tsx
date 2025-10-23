import React, { useState } from 'react';
import {
  Beaker,
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/card';
import Badge from '../../components/common/badge';
import { Input } from '../../components/common/input';
import Button from '../../components/common/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/common/table';

// 👉 import các dialog riêngg
import { EditReagentDialog } from './components/EditReagentDialog';
import { ReagentDetailDialog } from './components/ReagentDetailDialog';
import { AddReagentDialog } from './components/AddReagentDialog';
import type { Reagent } from './types/Reagent';

const ServiceReagentPage: React.FC = () => {
  const [reagents, setReagents] = useState<Reagent[]>([
    { id: 'R001', name: 'Hóa chất A', lotNumber: 'L001', manufacturer: 'Công ty X', quantity: 50, unit: 'chai', expiryDate: '2025-12-31', storageTemp: '2-8°C', status: 'available', minimumStock: 10, costPerUnit: 10000, location: 'Kệ A1' },
    { id: 'R002', name: 'Hóa chất B', lotNumber: 'L003', manufacturer: 'Công ty Y', quantity: 0, unit: 'chai', expiryDate: '2024-12-31', storageTemp: '2-8°C', status: 'low_stock', minimumStock: 10, costPerUnit: 10000, location: 'Kệ A1' },
    { id: 'R003', name: 'Hóa chất C', lotNumber: 'L003', manufacturer: 'Công ty Z', quantity: 30, unit: 'chai', expiryDate: '2023-12-31', storageTemp: '2-8°C', status: 'expired', minimumStock: 10, costPerUnit: 10000, location: 'Kệ A1' },

  ]);

  const [reagentSearchTerm, setReagentSearchTerm] = useState('');
  const [selectedReagent, setSelectedReagent] = useState<Reagent | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Stats
  const stats = {
    totalReagents: reagents.length,
    lowStockReagents: reagents.filter(r => r.status === 'low_stock').length,
    expiredReagents: reagents.filter(r => r.status === 'expired').length,
  };

  // Filter theo search
  const filteredReagents = reagents.filter((r) => {
    const search = reagentSearchTerm.toLowerCase();
    return (
      r.name.toLowerCase().includes(search) ||
      r.lotNumber.toLowerCase().includes(search) ||
      r.manufacturer.toLowerCase().includes(search) ||
      r.id.toLowerCase().includes(search)
    );
  });

  // Hàm thêm hóa chất
  const handleAddReagent = (newReagent: Reagent) => {
    setReagents([...reagents, newReagent]);
  };


  // Hàm sửa hóa chất
  const handleEditReagent = (updated: Reagent) => {
    setReagents(reagents.map(r => r.id === updated.id ? updated : r));
    setShowEditDialog(false);
    setSelectedReagent(null);
  };

  // Hàm xóa hóa chất
  const handleDeleteReagent = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa hóa chất này?')) {
      setReagents(reagents.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Quản lý Hóa chất</h2>
          <p className="text-gray-600">Thêm, sửa, xóa hóa chất trong hệ thống</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm hóa chất..."
              className="pl-10 w-80"
              value={reagentSearchTerm}
              onChange={(e) => setReagentSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="
    flex items-center 
    bg-gradient-to-r from-blue-500 to-indigo-600
    text-white font-medium shadow-md
    px-4 py-2 rounded-lg
    hover:from-blue-600 hover:to-indigo-700
    hover:shadow-lg
    focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1
    transition-all duration-200 ease-in-out
  "
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm hóa chất
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-strong hover-lift">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng hóa chất</p>
              <p className="text-2xl text-blue-600">{stats.totalReagents}</p>
            </div>
            <Beaker className="w-8 h-8 text-blue-600" />
          </CardContent>
        </Card>

        <Card className="glass-strong hover-lift">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sắp hết hàng</p>
              <p className="text-2xl text-orange-600">{stats.lowStockReagents}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </CardContent>
        </Card>

        <Card className="glass-strong hover-lift">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Hết hạn</p>
              <p className="text-2xl text-red-600">{stats.expiredReagents}</p>
            </div>
            <Clock className="w-8 h-8 text-red-600" />
          </CardContent>
        </Card>

        <Card className="glass-strong hover-lift">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Khả dụng</p>
              <p className="text-2xl text-green-600">{stats.totalReagents - stats.expiredReagents}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="glass-strong hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách Hóa chất</CardTitle>
              <CardDescription>
                Hiển thị {filteredReagents.length} / {reagents.length} hóa chất
              </CardDescription>
            </div>
            {reagentSearchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReagentSearchTerm('')}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredReagents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên hóa chất</TableHead>
                  <TableHead>Lô số</TableHead>
                  <TableHead>Nhà sản xuất</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Hạn sử dụng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReagents.map((reagent) => (
                  <TableRow key={reagent.id}>
                    <TableCell>{reagent.name}</TableCell>
                    <TableCell>{reagent.lotNumber}</TableCell>
                    <TableCell>{reagent.manufacturer}</TableCell>
                    <TableCell>{reagent.quantity} {reagent.unit}</TableCell>
                    <TableCell>{reagent.expiryDate}</TableCell>
                    <TableCell>
                      <Badge variant={
                        reagent.status === 'available' ? 'default' :
                          reagent.status === 'low_stock' ? 'secondary' : 'destructive'
                      }>
                        {reagent.status === 'available' ? 'Khả dụng' :
                          reagent.status === 'low_stock' ? 'Sắp hết' : 'Hết hạn'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReagent(reagent);
                            setShowDetailDialog(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReagent(reagent);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReagent(reagent.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Beaker className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg text-gray-900 mb-2">Không tìm thấy hóa chất</h3>
              <p className="text-sm text-gray-600 mb-4">
                Không có hóa chất nào phù hợp với tiêu chí tìm kiếm
              </p>
              <Button
                variant="outline"
                onClick={() => setReagentSearchTerm('')}
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 👉 Gắn 3 dialog component */}

      <AddReagentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddReagent={handleAddReagent}
      />

      <EditReagentDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        reagent={selectedReagent}
        onEditReagent={handleEditReagent}
      />


      <ReagentDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        reagent={selectedReagent}
      />

    </div>
  );
};

export default ServiceReagentPage;
