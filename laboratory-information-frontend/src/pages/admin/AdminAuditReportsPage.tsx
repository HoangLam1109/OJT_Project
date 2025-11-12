import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/card';
import { FileText, Download, Filter, Eye, Trash2, Shield, Database } from 'lucide-react';
import Button from '../../components/common/button';
import { Input } from '../../components/common/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/common/select';
import { eventLogService, type EventLog } from '../../service/eventLogService';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';
import { toast } from 'sonner';

export function AdminAuditReportsPage() {
  const navigate = useNavigate();
  const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name?: string } | null>(null);
  // removed modal-based viewing; now navigate to detail page
  const [serviceFilter, setServiceFilter] = useState<'all' | 'IAM_SERVICE' | 'PATIENT_SERVICE' | 'TEST_ORDER_SERVICE' | 'MONITORING_SERVICE' | 'CHAT_SERVICE'>('all');
  const [actionFilter, setActionFilter] = useState<'all' | 'CREATE' | 'DELETE' | 'UPDATE'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await eventLogService.getAll({ page, limit: 10, search: searchTerm });
        if (!mounted) return;
        setEventLogs(res.logs || []);
        if (res.totalPages) setTotalPages(Number(res.totalPages));
      } catch (e) {
        console.error('Failed to load event logs', e);
        if (mounted) setError('Không thể tải nhật ký sự kiện');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [page, searchTerm]);

  const filteredSortedLogs = eventLogs
    // search: only operator name or email
    .filter(log => {
      const operator = `${log.operator_name ?? ''} ${log.operator_gmail ?? ''}`.toLowerCase();
      const term = searchTerm.toLowerCase();
      return operator.includes(term);
    })
    // filter by service
    .filter(log => serviceFilter === 'all' || log.service_name === serviceFilter)
    // filter by action
    .filter(log => actionFilter === 'all' || (String(log.action).toUpperCase() === actionFilter))
    // sort by occurred_at
    .sort((a, b) => {
      const ta = a.occurred_at ? new Date(a.occurred_at).getTime() : 0;
      const tb = b.occurred_at ? new Date(b.occurred_at).getTime() : 0;
      return sortOrder === 'newest' ? tb - ta : ta - tb;
    });

  const getActionIcon = (action: string) => {
    switch (String(action).toLowerCase()) {
      case 'login': return <Shield className="h-4 w-4" />;
      case 'create': return <Database className="h-4 w-4" />;
      case 'update': return <FileText className="h-4 w-4" />;
      case 'delete': return <Trash2 className="h-4 w-4" />;
      case 'view': return <Eye className="h-4 w-4" />;
      case 'export': return <Download className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  // Removed unused formatDate helper after table column restructure
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nhật ký sự kiện</h1>
          <p className="text-gray-600 mt-1">Báo cáo hoạt động và nhật ký kiểm toán hệ thống</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc nâng cao
          </Button>
        </div>
      </div>
      {loading && (
        <div className="text-sm text-gray-500">Đang tải dữ liệu...</div>
      )}
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">{eventLogs.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search: only user name/email */}
            <div className="flex-1">
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm theo tên hoặc email người dùng"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Service filter */}
            <div className="min-w-[220px]">
              <Select value={serviceFilter} onValueChange={(v) => setServiceFilter(v as typeof serviceFilter)}>
                <SelectTrigger className="bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Chức năng" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="all">Tất cả chức năng</SelectItem>
                  <SelectItem value="IAM_SERVICE">IAM_SERVICE</SelectItem>
                  <SelectItem value="PATIENT_SERVICE">PATIENT_SERVICE</SelectItem>
                  <SelectItem value="TEST_ORDER_SERVICE">TEST_ORDER_SERVICE</SelectItem>
                  <SelectItem value="MONITORING_SERVICE">MONITORING_SERVICE</SelectItem>
                  <SelectItem value="CHAT_SERVICE">CHAT_SERVICE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action filter */}
            <div className="min-w-[180px]">
              <Select value={actionFilter} onValueChange={(v) => setActionFilter(v as typeof actionFilter)}>
                <SelectTrigger className="bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Hành động" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="all">Tất cả hành động</SelectItem>
                  <SelectItem value="CREATE">CREATE</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="UPDATE">UPDATE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort by time */}
            <div className="min-w-[180px]">
              <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as typeof sortOrder)}>
                <SelectTrigger className="bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Thời gian" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchTerm || serviceFilter !== 'all' || actionFilter !== 'all' || sortOrder !== 'newest') && (
              <div className="flex items-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setServiceFilter('all');
                    setActionFilter('all');
                    setSortOrder('newest');
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Nhật ký sự kiện ({filteredSortedLogs.length})</CardTitle>
          <CardDescription>Theo dõi các thao tác và thay đổi dữ liệu trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
  <table className="w-full border-collapse table-fixed">
    <thead>
      <tr className="border-b border-gray-200">
        <th className="w-[22%] text-left py-3 px-4 font-semibold text-sm text-gray-700">Người dùng</th>
        <th className="w-[18%] text-left py-3 px-4 font-semibold text-sm text-gray-700">Chức năng</th>
        <th className="w-[34%] text-left py-3 px-4 font-semibold text-sm text-gray-700">Hành động & Thông điệp</th>
        <th className="w-[16%] text-left py-3 px-4 font-semibold text-sm text-gray-700">Thời gian</th>
        <th className="w-[10%] text-center py-3 px-4 font-semibold text-sm text-gray-700">Thao tác</th>
      </tr>
    </thead>
    <tbody>
      {filteredSortedLogs.map((log) => {
        const rowKey = (log.event_id || log._id || log.id || log.operator_id || Math.random().toString());
        return (
          <tr key={rowKey} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="py-3 px-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                  {String(log.operator_name ?? log.operator_gmail ?? 'U').charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <div className="font-medium text-gray-900 truncate">{log.operator_name || 'Không rõ'}</div>
                  {log.operator_gmail && <div className="text-xs text-gray-500 truncate">{log.operator_gmail}</div>}
                </div>
              </div>
            </td>
            <td className="py-3 px-4 text-sm truncate" title={log.service_name}>{log.service_name || '—'}</td>
            <td className="py-3 px-4">
              <div className="flex items-start gap-2">
                {getActionIcon(String(log.action))}
                <div className="truncate max-w-[540px]">
                  <div className="font-medium text-gray-900 truncate">{log.action || '—'}</div>
                  {log.event_message && <div className="text-xs text-gray-500 truncate">{log.event_message}</div>}
                </div>
              </div>
            </td>
            <td className="py-3 px-4 text-sm" title={log.occurred_at ? new Date(log.occurred_at).toLocaleString('vi-VN') : ''}>
              {log.occurred_at ? new Date(log.occurred_at).toLocaleString('vi-VN') : '—'}
            </td>
            <td className="py-3 px-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  title="Xem chi tiết"
                  disabled={!log.event_id}
                  onClick={() => navigate(`/admin/audit-reports/${log.event_id}`)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Xóa"
                  className="text-red-600 hover:text-red-700"
                  disabled={!log.event_id}
                  onClick={() => setDeleteTarget({ id: (log.event_id || ''), name: log.operator_name })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          className="px-2 py-1 rounded border disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          aria-label="Trang trước"
        >
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-2 py-1 rounded border disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          aria-label="Trang sau"
        >
          ›
        </button>
      </div>

      {/* Delete confirm */}
      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        itemName={deleteTarget?.name}
        description={"Bạn có muốn xóa nhật ký này? Hành động này không thể hoàn tác."}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            const ok = await eventLogService.delete(deleteTarget.id);
            if (ok) {
              // Reload current page data after successful deletion
              toast.success('Xóa nhật ký thành công');
              const res = await eventLogService.getAll({ page, limit: 10, search: searchTerm });
              setEventLogs(res.logs || []);
              if (res.totalPages) setTotalPages(Number(res.totalPages));
            } else {
              toast.error('Xóa nhật ký thất bại');
            }
          } catch (err) {
            console.error('Failed to delete event log', err);
            toast.error('Xóa nhật ký thất bại');
          } finally {
            setDeleteTarget(null);
          }
        }}
      />

      {/* Modal removed: view navigates to detail page */}
    </div>
  );
}
