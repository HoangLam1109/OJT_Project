import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/card';
import Button from '../../components/common/button';
import { toast } from 'sonner';
import { UserPlus, User } from 'lucide-react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { PatientAPI, type Patient } from './data/mockPatientsData';
import PatientTable from './components/PatientTable';
import PatientToolbar from './components/PatientToolbar';
import PatientFormModal from './components/modals/PatientFormModal';
import PatientDetailModal from './components/modals/PatientDetailModal';
import { filterPatients } from './utils/patientUtils';

const PatientManagementPage: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && user.role[0] !== 'LAB_USER') {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    const filtered = filterPatients(patients, searchTerm, genderFilter);
    setFilteredPatients(filtered);
  }, [patients, searchTerm, genderFilter]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await PatientAPI.fetchPatients();
      setPatients(data);
    } catch (error) {
      toast.error('Không thể tải danh sách bệnh nhân');
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPatient(null);
    setIsEdit(false);
    setFormModalOpen(true);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEdit(true);
    setFormModalOpen(true);
  };

  const handleView = (patient: Patient) => {
    setSelectedPatient(patient);
    setDetailModalOpen(true);
    console.log(`[AUDIT] E_00015 | Patient viewed by ${user?.name || 'Lab User'}`);
  };

  const handleFormSubmit = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'createdBy'> | Partial<Patient>) => {
    try {
      if (isEdit && selectedPatient) {
        await PatientAPI.updatePatient(selectedPatient.id, patientData);
        toast.success('Đã cập nhật thông tin bệnh nhân thành công');
      } else {
        const result = await PatientAPI.createPatient(patientData as Omit<Patient, 'id' | 'createdAt' | 'createdBy'>);
        toast.success(`Đã tạo hồ sơ bệnh nhân thành công với mã: ${result.id}`);
      }
      setFormModalOpen(false);
      await loadPatients();
    } catch (error) {
      toast.error('Không thể lưu thông tin bệnh nhân');
      console.error('Error saving patient:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý hồ sơ bệnh nhân</h1>
          <p className="text-gray-600">Tạo, xem và quản lý thông tin bệnh nhân</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={handleCreate} className="flex items-center">
            <UserPlus className="w-4 h-4 mr-2" />
            Thêm bệnh nhân
          </Button>
          <div className="flex items-center space-x-2">
            <User className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-gray-500">
              {filteredPatients.length} / {patients.length} bệnh nhân
            </span>
          </div>
        </div>
      </div>

      <PatientToolbar
        searchTerm={searchTerm}
        genderFilter={genderFilter}
        onSearchChange={setSearchTerm}
        onGenderFilterChange={setGenderFilter}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Danh sách bệnh nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có bệnh nhân</h3>
              <p className="text-gray-500">
                {searchTerm || genderFilter !== 'All' 
                  ? 'Không tìm thấy bệnh nhân phù hợp với bộ lọc'
                  : 'Chưa có bệnh nhân nào được tạo'
                }
              </p>
            </div>
          ) : (
            <PatientTable
              patients={filteredPatients}
              onView={handleView}
              onEdit={handleEdit}
            />
          )}
        </CardContent>
      </Card>

      <PatientFormModal
        patient={selectedPatient}
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        isEdit={isEdit}
      />

      <PatientDetailModal
        patient={selectedPatient}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />
    </div>
  );
};

export default PatientManagementPage;
