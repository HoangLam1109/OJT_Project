import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Eye,
  Search,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../components/common/card';

import Badge from '../../components/common/badge';
import { Input } from '../../components/common/input';
import Button from '../../components/common/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/common/dialog';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../../components/common/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/common/select';
import { Label } from '../../components/common/label';

interface EventLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  relatedTable: string;
  severityLevel: 'Info' | 'Warning' | 'Error';
  message: string;
  details?: Record<string, unknown>;
}

type Severity = 'all' | 'Info' | 'Warning' | 'Error';

const ServiceEventLogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'Info' | 'Warning' | 'Error'>('all');
  const [showEventDetailDialog, setShowEventDetailDialog] = useState(false);
  const [selectedEventLog, setSelectedEventLog] = useState<EventLog | null>(null);

  // Hardcode dữ liệu sự kiện
  const eventLogs: EventLog[] = [
    {
      id: 'EV001',
      timestamp: '2025-10-22 22:00:00',
      action: 'Login',
      user: 'Linh Vo',
      relatedTable: 'User',
      severityLevel: 'Info',
      message: 'Người dùng đăng nhập thành công',
    },
    {
      id: 'EV002',
      timestamp: '2025-10-22 22:05:00',
      action: 'Delete',
      user: 'Admin',
      relatedTable: 'Post',
      severityLevel: 'Warning',
      message: 'Bài viết bị xóa bởi admin',
    },
    {
      id: 'EV003',
      timestamp: '2025-10-22 22:10:00',
      action: 'Error',
      user: 'System',
      relatedTable: 'Database',
      severityLevel: 'Error',
      message: 'Lỗi kết nối database',
    },
  ];

  const filteredLogs = eventLogs.filter((log) => {
    const matchesSearch =
      searchTerm === '' ||
      (log.message?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (log.user?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (log.action?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (log.relatedTable?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesSeverity =
      severityFilter === 'all' || (log.severityLevel?.toLowerCase() || '') === severityFilter.toLowerCase();

    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header with search and filter */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Nhật ký Sự kiện</h2>
          <p className="text-gray-600">Theo dõi tất cả các sự kiện trong hệ thống</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm sự kiện..."
              className="pl-10 w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={severityFilter} onValueChange={(value: Severity) => setSeverityFilter(value as Severity)}>
            <SelectTrigger className="
                                      w-48 
                                      bg-gray-50 
                                      text-gray-800 
                                      font-medium 
                                      border border-gray-400 
                                      rounded-md 
                                      shadow-sm 
                                      ring-1 ring-gray-200 
                                      hover:border-gray-500 
                                      focus:ring-2 focus:ring-blue-400 
                                      transition-all 
                                      duration-200
  ">
              <SelectValue placeholder="Lọc theo mức độ" />
            </SelectTrigger>
            <SelectContent
              className="
                        bg-gray-50 
                        text-gray-800 
                        font-medium
                        shadow-xl 
                        rounded-lg 
                        border border-gray-500 
                        ring-1 ring-gray-300 
                        hover:ring-gray-400 
                        transition-all 
                        duration-200
"

            >
              <SelectItem
                value="all"
                className="hover:bg-blue-100 hover:text-blue-700 cursor-pointer px-3 py-2 rounded-sm"
              >
                Tất cả mức độ
              </SelectItem>
              <SelectItem
                value="Info"
                className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer px-3 py-2 rounded-sm"
              >
                Info
              </SelectItem>
              <SelectItem
                value="Warning"
                className="hover:bg-yellow-50 hover:text-yellow-700 cursor-pointer px-3 py-2 rounded-sm"
              >
                Warning
              </SelectItem>
              <SelectItem
                value="Error"
                className="hover:bg-red-50 hover:text-red-700 cursor-pointer px-3 py-2 rounded-sm"
              >
                Error
              </SelectItem>
            </SelectContent>


          </Select>
        </div>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-strong hover-lift">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Tổng sự kiện</p>
              <p className="text-2xl">{eventLogs.length}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </CardContent>
        </Card>

        <Card className="glass-strong hover-lift">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Lỗi</p>
              <p className="text-2xl text-red-600">{eventLogs.filter(e => e.severityLevel === 'Error').length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </CardContent>
        </Card>

        <Card className="glass-strong hover-lift">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Cảnh báo</p>
              <p className="text-2xl text-yellow-600">{eventLogs.filter(e => e.severityLevel === 'Warning').length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </CardContent>
        </Card>

        <Card className="glass-strong hover-lift">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Thông tin</p>
              <p className="text-2xl text-blue-600">{eventLogs.filter(e => e.severityLevel === 'Info').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </CardContent>
        </Card>
      </div>

      {/* Event Log Table */}
      <Card className="glass-strong">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách Sự kiện</CardTitle>
              <CardDescription>
                Hiển thị {filteredLogs.length} / {eventLogs.length} sự kiện
              </CardDescription>
            </div>
            {(searchTerm || severityFilter !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSeverityFilter('all');
                }}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Hành động</TableHead>
                  <TableHead>Người thực hiện</TableHead>
                  <TableHead>Đối tượng</TableHead>
                  <TableHead>Mức độ</TableHead>
                  <TableHead className="text-right">Chi tiết</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.action}</Badge>
                    </TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{log.relatedTable}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          log.severityLevel === 'Error'
                            ? 'destructive'
                            : log.severityLevel === 'Warning'
                              ? 'secondary'
                              : 'default'
                        }
                      >
                        {log.severityLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEventLog(log);
                          setShowEventDetailDialog(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg text-gray-900 mb-2">Không tìm thấy sự kiện</h3>
              <p className="text-sm text-gray-600 mb-4">
                Không có sự kiện nào phù hợp với tiêu chí tìm kiếm
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSeverityFilter('all');
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Detail Dialog */}
      <Dialog open={showEventDetailDialog} onOpenChange={setShowEventDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết Sự kiện</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về sự kiện trong hệ thống
            </DialogDescription>
          </DialogHeader>
          {selectedEventLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">ID Sự kiện</Label>
                  <p className="font-mono text-sm">{selectedEventLog.id}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Thời gian</Label>
                  <p className="font-mono text-sm">{selectedEventLog.timestamp}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Người thực hiện</Label>
                  <p>{selectedEventLog.user}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Mức độ</Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        selectedEventLog.severityLevel === 'Error'
                          ? 'destructive'
                          : selectedEventLog.severityLevel === 'Warning'
                            ? 'secondary'
                            : 'default'
                      }
                    >
                      {selectedEventLog.severityLevel}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Hành động</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedEventLog.action}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Đối tượng</Label>
                  <p>{selectedEventLog.relatedTable}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-600">Thông điệp</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">{selectedEventLog.message}</p>
              </div>

              {selectedEventLog.details && (
                <div>
                  <Label className="text-sm text-gray-600">Chi tiết bổ sung</Label>
                  <pre className="mt-1 p-3 bg-gray-50 rounded-lg text-xs overflow-auto">
                    {JSON.stringify(selectedEventLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDetailDialog(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceEventLogPage;
