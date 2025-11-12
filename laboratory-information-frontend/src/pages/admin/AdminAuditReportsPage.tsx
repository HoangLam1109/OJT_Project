import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/card';
import { FileText, Download, Filter, Eye, Trash2, Shield, Database } from 'lucide-react';
import Button from '../../components/common/button';
import { Input } from '../../components/common/input';
import { patientAuditLogService, type PatientAuditLog } from '../../service/patientAuditLogService';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';
import { PatientAuditLogModal } from './components/PatientAuditLogModal';
import { toast } from 'sonner';

export function AdminAuditReportsPage() {
  const [auditLogs, setAuditLogs] = useState<PatientAuditLog[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name?: string } | null>(null);
  const [viewLogId, setViewLogId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await patientAuditLogService.getAuditLogs({ page, limit: 10 });
        if (!mounted) return;
        setAuditLogs(res.logs || []);
        if (res.totalPages) setTotalPages(Number(res.totalPages));
      } catch (e) {
        console.error('Failed to load audit logs', e);
        if (mounted) setError('Không thể tải nhật ký kiểm toán');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [page]);

  const filteredLogs = auditLogs.filter(log => {
    const performedBy = String(log.performed_by ?? '').toLowerCase();
    const action = String(log.action ?? '').toLowerCase();
    const message = String(log.event_message ?? '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return performedBy.includes(term) || action.includes(term) || message.includes(term);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Kiểm toán</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo người dùng, hành động, tài nguyên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {/* Optional future filters can go here */}
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Nhật ký kiểm toán ({filteredLogs.length})</CardTitle>
          <CardDescription>Theo dõi các hoạt động của người dùng trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
  <table className="w-full border-collapse table-fixed">
    <thead>
      <tr className="border-b border-gray-200">
        <th className="w-[18%] text-left py-3 px-4 font-semibold text-sm text-gray-700">Thời gian</th>
        <th className="w-[30%] text-left py-3 px-4 font-semibold text-sm text-gray-700">Người dùng</th>
        <th className="w-[40%] text-left py-3 px-4 font-semibold text-sm text-gray-700">Hành động</th>
        <th className="w-[12%] text-center py-3 px-4 font-semibold text-sm text-gray-700">
  Thao tác
</th>
      </tr>
    </thead>
    <tbody>
      {filteredLogs.map((log) => (
        <tr key={log._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
          {/* Thời gian */}
          <td className="py-3 px-4 truncate max-w-[180px]" title={formatDate(log.performed_at)}>
            <div className="text-sm text-gray-900">{formatDate(log.performed_at)}</div>
          </td>

          {/* Người dùng */}
          <td className="py-3 px-4 truncate max-w-[260px]" title={log.performed_by}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                {String(log.performed_by ?? 'U').charAt(0).toUpperCase()}
              </div>
              <div className="font-medium text-gray-900 truncate">{log.performed_by || 'Không rõ'}</div>
            </div>
          </td>

          {/* Hành động */}
          <td className="py-3 px-4 truncate max-w-[340px]" title={log.event_message}>
            <div className="flex items-center gap-2">
              {getActionIcon(String(log.action))}
              <div>
                <div className="font-medium text-gray-900 truncate">{String(log.action)}</div>
                {log.event_message && (
                  <div className="text-sm text-gray-500 truncate">{log.event_message}</div>
                )}
              </div>
            </div>
          </td>

          {/* Thao tác */}
          <td className="py-3 px-4 text-center">
  <div className="flex items-center justify-center gap-2">
    <Button
      variant="ghost"
      size="icon"
      title="Xem chi tiết"
      onClick={() => setViewLogId(log._id)}
    >
      <Eye className="w-4 h-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      title="Xóa"
      className="text-red-600 hover:text-red-700"
      onClick={() => setDeleteTarget({ id: log._id, name: log.performed_by })}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  </div>
</td>
        </tr>
      ))}
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
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            const ok = await patientAuditLogService.deleteAuditLog(deleteTarget.id);
            if (ok) {
              setAuditLogs((prev) => prev.filter((l) => l._id !== deleteTarget.id));
              toast.success('Xóa nhật ký thành công'); 
            } else {
              toast.error('Xóa nhật ký thất bại'); 
            }
          } catch (err) {
            console.error('Failed to delete audit log', err);
            toast.error('Xóa nhật ký thất bại');
          } finally {
            setDeleteTarget(null);
          }
        }}
      />

      <PatientAuditLogModal
        isOpen={Boolean(viewLogId)}
        logId={viewLogId}
        onClose={() => setViewLogId(null)}
      />
    </div>
  );
}
