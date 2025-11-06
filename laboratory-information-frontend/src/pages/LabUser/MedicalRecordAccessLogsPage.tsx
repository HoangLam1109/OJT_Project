import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/card';
import Button from '../../components/common/button';
import { Eye, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { medicalRecordAccessLogService, type MedicalRecordAccessLog } from '../../service/medicalRecordAccessLogService';
import { DeleteConfirmDialog } from '../admin/components/DeleteConfirmDialog';
import { MedicalRecordAccessLogModal } from './components/MedicalRecordAccessLogModal';

export default function MedicalRecordAccessLogsPage() {
  const [logs, setLogs] = useState<MedicalRecordAccessLog[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; email?: string } | null>(null);
  const [viewLogId, setViewLogId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await medicalRecordAccessLogService.getAll({ page, limit: 10 });
        if (!mounted) return;
        setLogs(res.logs || []);
        if (res.totalPages) setTotalPages(Number(res.totalPages));
      } catch (e) {
        console.error('Failed to load medical record access logs', e);
        if (mounted) setError('Không thể tải nhật ký truy cập hồ sơ y tế');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [page]);

  const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleString('vi-VN') : '-');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nhật ký truy cập hồ sơ y tế</h1>
          <p className="text-gray-600 mt-1">Theo dõi việc truy cập, xem và cập nhật hồ sơ y tế</p>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-500">Đang tải dữ liệu...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Nhật ký ({logs.length})</CardTitle>
          <CardDescription>Danh sách tất cả lượt truy cập/ thao tác</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="w-[22%] text-left py-3 px-4 font-semibold text-sm text-gray-700">Thời gian</th>
                  <th className="w-[34%] text-left py-3 px-4 font-semibold text-sm text-gray-700">Người dùng</th>
                  <th className="w-[32%] text-left py-3 px-4 font-semibold text-sm text-gray-700">Hành động</th>
                  <th className="w-[12%] text-center py-3 px-4 font-semibold text-sm text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 truncate max-w-[200px]" title={formatDate(log.accessed_at)}>
                      <div className="text-sm text-gray-900">{formatDate(log.accessed_at)}</div>
                    </td>
                    <td className="py-3 px-4 truncate max-w-[320px]" title={log.accessed_by_email}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                          {String(log.accessed_by_email ?? 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="font-medium text-gray-900 truncate">{log.accessed_by_email || 'Không rõ'}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 truncate max-w-[340px]" title={log.access_type}>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <div className="font-medium text-gray-900 truncate">{String(log.access_type || '-')}</div>
                      </div>
                    </td>
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
                          onClick={() => setDeleteTarget({ id: log._id, email: log.accessed_by_email || undefined })}
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
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        itemName={deleteTarget?.email || 'nhật ký'}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            const ok = await medicalRecordAccessLogService.delete(deleteTarget.id);
            if (ok) {
              setLogs((prev) => prev.filter((l) => l._id !== deleteTarget.id));
              toast.success('Xóa nhật kí thành công');
            } else {
              toast.error('Xóa nhật kí thất bại');
            }
          } catch (err) {
            console.error('Failed to delete access log', err);
            toast.error('Xóa nhật kí thất bại');
          } finally {
            setDeleteTarget(null);
          }
        }}
      />

      <MedicalRecordAccessLogModal
        isOpen={Boolean(viewLogId)}
        logId={viewLogId}
        onClose={() => setViewLogId(null)}
      />
    </div>
  );
}


