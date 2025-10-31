import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/card';
import { Users, Plus, Search, Eye, Edit, Trash2, Phone, Mail, MapPin, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/common/button';
import { Input } from '../../components/common/input';
import type { Patient } from './data/mockPatients';
import { fetchPatients as fetchPatientsFromApi, deletePatient as deletePatientApi, updatePatient as updatePatientApi } from '../../service/patientService';
import { usePatientModal } from './hooks/usePatientModal';
import { PatientModal } from './components/PatientModal';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';
import { toast } from 'sonner';


export function AdminPatientManagementPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name?: string } | null>(null);




  const { modalState, openCreateModal, openViewModal, openEditModal, closeModal } = usePatientModal();


  // render pagination controls
  const renderPagination = () => (

    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        className="px-2 py-1 rounded border disabled:opacity-50"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        aria-label="Trang trước"
      >
        <ChevronLeft className="w-4 h-4" />
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
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.identifyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || patient.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'deceased': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Không hoạt động';
      case 'deceased': return 'Đã mất';
      default: return status;
    }
  };

  // Return color classes for blood type badge (kept simple)
  // const getBloodTypeColor = (bloodType?: string) => {
  //   // You can adjust colors per bloodType if needed
  //   return 'bg-blue-100 text-blue-800';
  // };
  const getBloodTypeColor = () => {
    return 'bg-blue-100 text-blue-800';
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const backend = await fetchPatientsFromApi(page, 10);
        console.log("API:", backend);
        const backendArr = backend.patients ?? [];
        const mapped: Patient[] = backendArr.map((b: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const bb: any = b;
          const user = bb.user ?? {};
          const getFrom = (key: string) => user[key] ?? bb[key] ?? bb[key.replace(/([A-Z])/g, '_$1').toLowerCase()];
          const rawGender = String(getFrom('gender') || getFrom('gender') || 'male').toLowerCase();
          const gender = rawGender === 'female' ? 'female' : rawGender === 'other' ? 'other' : 'male';
          const bloodTypeRaw = String(getFrom('bloodType') || 'O+');
          const allowed = ['O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O-'];
          const bloodType = (allowed.includes(bloodTypeRaw) ? bloodTypeRaw : 'O+') as Patient['bloodType'];

          const id = String(bb._id ?? bb.id ?? bb.patientId ?? '');
          const name = String(user.fullName ?? user.name ?? bb.fullName ?? bb.name ?? '');
          const email = String(user.email ?? bb.email ?? '');
          const phone = String(user.phoneNumber ?? user.phone ?? bb.phone ?? '');
          const identifyNumber = String(user.identityNumber ?? user.identifyNumber ?? bb.identityNumber ?? '');
          const dateOfBirth = String(user.dateOfBirth ?? bb.dateOfBirth ?? bb.date_of_birth ?? '');
          const age = Number(user.age ?? bb.age ?? 0);
          const address = String(user.address ?? bb.address ?? '');
          const emergencyObj = (bb.emergency_contact ?? bb.emergencyContact ?? {}) as Record<string, unknown>;
          const medicalHistory = Array.isArray(bb.medicalHistory) ? bb.medicalHistory as string[] : (bb.medicalHistory ? [String(bb.medicalHistory)] : []);
          const allergies = Array.isArray(bb.allergies) ? bb.allergies as string[] : [];
          const status = String(bb.is_active === false ? 'inactive' : (bb.is_deleted ? 'deceased' : (bb.status ?? 'active')));
          const createdAt = String(bb.created_at ?? bb.createdAt ?? '');
          const updatedAt = String(bb.updated_at ?? bb.updatedAt ?? '');
          const lastVisit = String(bb.last_visit_date ?? bb.lastVisit ?? '');

          return {
            id,
            name,
            email,
            phone,
            identifyNumber,
            gender,
            dateOfBirth,
            age,
            address,
            emergencyContact: { name: String(emergencyObj['name'] ?? ''), phone: String(emergencyObj['phone'] ?? ''), relationship: String(emergencyObj['relationship'] ?? '') },
            medicalHistory,
            allergies,
            bloodType,
            status: status as Patient['status'],
            createdAt,
            updatedAt,
            lastVisit,
          } as Patient;
        });
        if (mounted) setPatients(mapped);
        if (backend.totalPages) setTotalPages(Number(backend.totalPages));
      } catch (err) {
        console.error('Error loading patients:', err);
        if (mounted) setError('Không thể tải danh sách bệnh nhân');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [page]);
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý bệnh nhân</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin bệnh nhân và hồ sơ y tế</p>
        </div>
        {/* <div className="flex space-x-3">
          <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Thêm bệnh nhân
          </Button>
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div> */}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng bệnh nhân</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">
                  {patients.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Có tiền sử bệnh</p>
                <p className="text-2xl font-bold text-orange-600">
                  {patients.filter(p => p.medicalHistory.length > 0).length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Có dị ứng</p>
                <p className="text-2xl font-bold text-red-600">
                  {patients.filter(p => p.allergies.length > 0 && p.allergies[0] !== 'Không có').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên, số điện thoại, CMND..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="lg:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="deceased">Đã mất</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bệnh nhân ({filteredPatients.length})</CardTitle>
          <CardDescription>Quản lý thông tin bệnh nhân trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-center text-gray-500 py-4">Đang tải dữ liệu...</div>}
          {error && <div className="text-center text-red-600 py-4">{error}</div>}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Bệnh nhân</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Thông tin liên hệ</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Nhóm máu</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Lần khám cuối</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">
                            {patient.gender === 'male' ? 'Nam' : patient.gender === 'female' ? 'Nữ' : 'Khác'} • {patient.age} tuổi
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{patient.phone}</span>
                        </div>
                        {patient.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span>{patient.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-32">{patient.address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBloodTypeColor()}`}>
                        {patient.bloodType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                        {getStatusLabel(patient.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('vi-VN') : 'Chưa có'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Xem chi tiết"
                          onClick={() => openViewModal(patient.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Chỉnh sửa"
                          onClick={() => openEditModal(patient.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Xóa"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setDeleteTarget({ id: patient.id, name: patient.name })}
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
      {renderPagination()}
      {/* Patient modal and delete confirm */}
      <PatientModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        patient={modalState.patient}
        onClose={closeModal}
        onSubmit={async (data) => {
          // Only update emergency contact fields
          if (!modalState.patient) {
            console.error('Missing patient for update');
            toast.error('Cập nhật thất bại');
            return;
          }

          const patientId = modalState.patient._id ?? modalState.patient.id;
          if (!patientId) {
            console.error('Missing patient ID for update');
            toast.error('Cập nhật thất bại');
            return;
          }

          try {
            const d = data as Record<string, unknown>;
            const name = String(d['emergency_name'] ?? '');
            const phone = String(d['emergency_phone'] ?? '');

            const payload = {
              id: patientId,
              emergency_contact: { name, phone }
            };

            console.log('Updating patient', { id: patientId, payload });

            // Gọi API cập nhật
            const updated = await updatePatientApi(patientId, payload);

            if (updated) {
              console.log('Update successful', updated);

              // Cập nhật danh sách local
              setPatients((prev) =>
                prev.map((p) => {
                  if (p.id === patientId) {
                    return {
                      ...p,
                      emergencyContact: {
                        name: payload.emergency_contact.name,
                        phone: payload.emergency_contact.phone,
                        relationship: p.emergencyContact?.relationship ?? ''
                      }
                    };
                  }
                  return p;
                })
              );

              toast.success('Cập nhật người dùng thành công ');
              closeModal();
            } else {
              console.error('Update failed - no response from server');
              toast.error('Cập nhật thất bại');
            }
          } catch (err) {
            console.error('Failed to update patient:', err);
            toast.error('Cập nhật thất bại');
          }
        }}
      />


      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        itemName={deleteTarget?.name}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            const ok = await deletePatientApi(deleteTarget.id);
            if (ok) {
              // remove locally
              setPatients((prev) => prev.filter((p) => p.id !== deleteTarget.id));
              toast.success('Xóa bệnh nhân thành công');
            } else {
              console.error('Failed to delete patient', deleteTarget.id);
              toast.error('Xóa bệnh nhân thất bại');
            }
          } catch (err) {
            console.error('Failed to delete patient', deleteTarget.id, err);
            toast.error('Xóa bệnh nhân thất bại');
          } finally {
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
