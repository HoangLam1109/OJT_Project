import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/card';
import Button from '../../components/common/button';
import { Input } from '../../components/common/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/common/select';
import { patientMedicalRecordService, type PatientMedicalRecord } from '../../service/patientMedicalRecordService';
import { FileText, Search, Eye, Pencil, Trash2 } from 'lucide-react';
import { patientService, type PatientOption } from '../../service/patientService';
import AddPatientMedicalRecord from './components/AddPatientMedicalRecord';
import EditPatientMedicalRecord from './components/EditPatientMedicalRecord';
import { DeleteConfirmDialog } from '../admin/components/DeleteConfirmDialog';
import { toast } from 'sonner';
// duplicate import removed

export default function PatientMedicalRecordsPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<PatientMedicalRecord[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Bộ lọc
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('updated_at:desc');

  // Bản đồ patient cho hiển thị fullname, vv.
  const [patientMap, setPatientMap] = useState<Record<string, PatientOption>>({});
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name?: string } | null>(null);
  // no-op: patients for modal are loaded inside modal component

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await patientMedicalRecordService.getAll({ page, limit, search, sort });
        if (!mounted) return;
        setRecords(res.records || []);
        if (typeof res.totalPages === 'number') setTotalPages(res.totalPages || 1);

        // Nối dữ liệu bệnh nhân theo patient_id
        const uniqueIds = Array.from(new Set((res.records || []).map(r => r.patient_id).filter(Boolean))) as string[];
        const map: Record<string, PatientOption> = {};
        await Promise.all(uniqueIds.map(async (id) => {
          try {
            const p = await patientService.getPatientById(id);
            if (p) map[id] = p;
          } catch {
            // bỏ qua lỗi từng bản ghi
          }
        }));
        if (mounted) setPatientMap(map);
      } catch {
        if (mounted) setError('Không thể tải danh sách hồ sơ y tế');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [page, limit, search, sort, refreshKey]);

  // Preload a small patient cache for list rendering (not for form)

  const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleString('vi-VN') : '-';
  const formatDateOnly = (iso?: string) => iso ? new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-';

  const summary = useMemo(() => ({
    total: records.length,
  }), [records.length]);

  // Lọc và sắp xếp client-side: search theo fullname/record_code, sort theo updated_at
  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = records;
    if (term) {
      list = list.filter(r => {
        const fullName = patientMap[r.patient_id || '']?.fullName?.toLowerCase() || '';
        const recordCode = (r.record_code || '').toLowerCase();
        return fullName.includes(term) || recordCode.includes(term);
      });
    }
    const desc = sort === 'updated_at:desc';
    const asc = sort === 'updated_at:asc';
    if (desc || asc) {
      list = [...list].sort((a, b) => {
        const ta = new Date(a.updated_at || a.created_at || 0).getTime();
        const tb = new Date(b.updated_at || b.created_at || 0).getTime();
        return desc ? tb - ta : ta - tb;
      });
    }
    return list;
  }, [records, search, sort, patientMap]);

  return (
    <div className="space-y-6">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hồ sơ y tế bệnh nhân</h1>
          <p className="text-gray-600 mt-1">Danh sách toàn bộ hồ sơ y tế, cho phép tìm kiếm, lọc và sắp xếp</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCreateOpen(true)}>Tạo hồ sơ</Button>
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng số bản ghi trang hiện tại</p>
                <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Tìm theo tên bệnh nhân, mã hồ sơ" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} className="pl-10" />
              </div>
            </div>
            <div>
              <Select value={sort} onValueChange={(v) => { setPage(1); setSort(v); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated_at:desc">Mới nhất</SelectItem>
                  <SelectItem value="updated_at:asc">Cũ nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddPatientMedicalRecord open={createOpen} onOpenChange={setCreateOpen} onCreated={() => setRefreshKey((k) => k + 1)} />

      {/* Bảng danh sách */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hồ sơ y tế</CardTitle>
          <CardDescription>Chỉ người có quyền mới được truy cập. Mọi lượt xem đều được ghi nhật ký.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-sm text-gray-500">Đang tải dữ liệu...</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse table-fixed">
                <thead>
  <tr className="border-b border-gray-200">
    <th className="w-[14%] text-left py-3 px-4 font-semibold text-sm text-gray-700">Mã hồ sơ</th>
    <th className="w-[22%] text-left py-3 px-4 font-semibold text-sm text-gray-700">Họ và tên</th>
    <th className="w-[12%] text-left py-3 px-4 font-semibold text-sm text-gray-700">Ngày sinh</th>
    <th className="w-[28%] text-left py-3 px-4 font-semibold text-sm text-gray-700">Tóm tắt xét nghiệm gần đây</th>
    <th className="w-[14%] text-left py-3 px-4 font-semibold text-sm text-gray-700 pl-6">Cập nhật</th>
    <th className="w-[10%] text-center py-3 px-6 font-semibold text-sm text-gray-700">Thao tác</th>
  </tr>
</thead>
<tbody>
  {filteredRecords.map((r) => (
    <tr key={r._id} className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4 truncate">{r.record_code}</td>

      {/* Họ và tên */}
      <td className="py-3 px-4 truncate">
        {patientMap[r.patient_id || '']?.fullName || '-'}
      </td>

      {/* Ngày sinh */}
      <td className="py-3 px-4 truncate">
        {patientMap[r.patient_id || '']?.dateOfBirth
          ? formatDateOnly(patientMap[r.patient_id || ''].dateOfBirth)
          : '-'}
      </td>

      {/* Tóm tắt xét nghiệm gần đây */}
      <td className="py-3 px-4 truncate" title={r.recent_test_summary}>
        {r.recent_test_summary || '-'}
      </td>

      {/* Cập nhật */}
      <td className="py-3 px-6 truncate">{formatDate(r.updated_at || r.created_at)}</td>

      {/* Thao tác */}
      <td className="py-3 px-6">
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            title="Xem chi tiết"
            onClick={() => navigate(`/labuser/patient-medical-records/${r._id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Chỉnh sửa"
            onClick={() => setEditId(r._id)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Xóa"
            className="text-red-600 hover:text-red-700"
            onClick={() => setDeleteTarget({ id: r._id, name: r.record_code })}
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
          )}
        </CardContent>
      </Card>

      {/* Phân trang */}
      <div className="flex justify-center items-center gap-2 mt-2">
        <button className="px-2 py-1 rounded border disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Trang trước">‹</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i + 1} className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`} onClick={() => setPage(i + 1)}>
            {i + 1}
          </button>
        ))}
        <button className="px-2 py-1 rounded border disabled:opacity-50" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Trang sau">›</button>
      </div>
      <EditPatientMedicalRecord id={editId} open={Boolean(editId)} onOpenChange={(o) => { if (!o) setEditId(null); }} onUpdated={() => setRefreshKey((k) => k + 1)} />
      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        itemName={deleteTarget?.name}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            const ok = await patientMedicalRecordService.remove(deleteTarget.id);
            if (ok) {
              toast.success('Xóa hồ sơ thành công');
              setRefreshKey((k) => k + 1);
            } else {
              toast.error('Xóa hồ sơ thất bại');
            }
          } catch {
            toast.error('Xóa hồ sơ thất bại');
          } finally {
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}


