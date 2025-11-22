import type { Patient } from '../types/Patient';

  export interface TestOrder {
    id: string;
    patientId: string;
    testType: string;
    status: 'Pending' | 'Processing' | 'Completed' | 'Reviewed';
    createdAt: string;
  }

  export interface AuditLog {
    id: string;
    action: string;
    patientId: string;
    performedBy: string;
    performedAt: string;
    details?: string;
  }

  export const mockPatients: Patient[] = [
    {
      id: "P001",
      fullName: "Nguyễn Văn An",
      dateOfBirth: "1985-03-15",
      gender: "Male",
      phoneNumber: "0901234567",
      email: "nguyenvanan@email.com",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      medicalHistory: "Tiền sử dị ứng penicillin",
      createdAt: "2025-01-15",
      createdBy: "Lab User 1",
      updatedAt: "2025-01-20",
      updatedBy: "Lab User 2"
    },
    {
      id: "P002",
      fullName: "Trần Thị Bình",
      dateOfBirth: "1990-07-22",
      gender: "Female",
      phoneNumber: "0912345678",
      email: "tranthibinh@email.com",
      address: "456 Đường XYZ, Quận 2, TP.HCM",
      medicalHistory: "Tiền sử tiểu đường type 2",
      createdAt: "2025-01-16",
      createdBy: "Lab User 1"
    },
    {
      id: "P003",
      fullName: "Lê Văn Cường",
      dateOfBirth: "1978-11-08",
      gender: "Male",
      phoneNumber: "0923456789",
      email: "levancuong@email.com",
      address: "789 Đường DEF, Quận 3, TP.HCM",
      medicalHistory: "Tiền sử cao huyết áp",
      createdAt: "2025-01-17",
      createdBy: "Lab User 2",
      updatedAt: "2025-01-21",
      updatedBy: "Lab User 1"
    },
    {
      id: "P004",
      fullName: "Phạm Thị Dung",
      dateOfBirth: "1995-05-12",
      gender: "Female",
      phoneNumber: "0934567890",
      email: "phamthidung@email.com",
      address: "321 Đường GHI, Quận 4, TP.HCM",
      medicalHistory: "Không có tiền sử bệnh lý đặc biệt",
      createdAt: "2025-01-18",
      createdBy: "Lab User 3"
    },
    {
      id: "P005",
      fullName: "Hoàng Văn Em",
      dateOfBirth: "1988-09-30",
      gender: "Male",
      phoneNumber: "0945678901",
      email: "hoangvanem@email.com",
      address: "654 Đường JKL, Quận 5, TP.HCM",
      medicalHistory: "Tiền sử hen suyễn",
      createdAt: "2025-01-19",
      createdBy: "Lab User 2"
    }
  ];

  export const mockTestOrders: TestOrder[] = [
    {
      id: "TO-2025-001",
      patientId: "P001",
      testType: "Sinh hóa máu",
      status: "Completed",
      createdAt: "2025-01-20"
    },
    {
      id: "TO-2025-002",
      patientId: "P001",
      testType: "Huyết học tổng quát",
      status: "Processing",
      createdAt: "2025-01-21"
    },
    {
      id: "TO-2025-003",
      patientId: "P002",
      testType: "Miễn dịch",
      status: "Pending",
      createdAt: "2025-01-22"
    },
    {
      id: "TO-2025-004",
      patientId: "P003",
      testType: "Vi sinh",
      status: "Reviewed",
      createdAt: "2025-01-23"
    },
    {
      id: "TO-2025-005",
      patientId: "P004",
      testType: "Nội tiết",
      status: "Completed",
      createdAt: "2025-01-24"
    }
  ];

  export const mockAuditLogs: AuditLog[] = [
    {
      id: "AL001",
      action: "CREATE_PATIENT",
      patientId: "P001",
      performedBy: "Lab User 1",
      performedAt: "2025-01-15T10:30:00Z",
      details: "Tạo hồ sơ bệnh nhân mới"
    },
    {
      id: "AL002",
      action: "UPDATE_PATIENT",
      patientId: "P001",
      performedBy: "Lab User 2",
      performedAt: "2025-01-20T14:15:00Z",
      details: "Cập nhật thông tin liên hệ"
    },
    {
      id: "AL003",
      action: "VIEW_PATIENT",
      patientId: "P001",
      performedBy: "Lab User 1",
      performedAt: "2025-01-21T09:45:00Z",
      details: "Xem chi tiết hồ sơ bệnh nhân"
    },
    {
      id: "AL004",
      action: "CREATE_PATIENT",
      patientId: "P002",
      performedBy: "Lab User 1",
      performedAt: "2025-01-16T11:20:00Z",
      details: "Tạo hồ sơ bệnh nhân mới"
    },
    {
      id: "AL005",
      action: "UPDATE_PATIENT",
      patientId: "P003",
      performedBy: "Lab User 1",
      performedAt: "2025-01-21T16:30:00Z",
      details: "Cập nhật địa chỉ và tiền sử bệnh"
    }
  ];

  // Mock API functions
  // In-memory storage for dynamic data
  const dynamicPatients: Patient[] = [...mockPatients];

  export const PatientAPI = {
    fetchPatients: async (): Promise<Patient[]> => {
      // Try backend patient service first; fall back to mock data
      try {
        // lazy import to avoid circular deps
        const { fetchPatients: fetchFromApi } = await import('../../../service/patientService');
        const backend = await fetchFromApi();
        if (Array.isArray(backend) && backend.length > 0) {
          const backendArr = backend as unknown as Record<string, unknown>[];
          const mapped: Patient[] = backendArr.map((b) => {
            // prefer nested user fields when present
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const bb: any = b;
            const user = bb.user ?? {};
            const mh = bb.medicalHistory ?? user.medicalHistory ?? bb.medical_history;
            const medicalHistory = Array.isArray(mh) ? (mh as unknown[]).join('; ') : String(mh ?? '');

            const id = String(bb._id ?? bb.id ?? bb.patient_code ?? bb.patientId ?? '');
            const fullName = String(user.fullName ?? user.name ?? bb.fullName ?? bb.name ?? '');
            const dobRaw = user.dateOfBirth ?? user.date_of_birth ?? bb.dateOfBirth ?? bb.date_of_birth ?? '';
            const dateOfBirth = String(dobRaw);
            const rawGender = String(user.gender ?? bb.gender ?? 'male').toLowerCase();
            const gender = rawGender === 'female' ? 'Female' : rawGender === 'other' ? 'Other' : 'Male';
            const phoneNumber = String(user.phoneNumber ?? user.phone ?? bb.phoneNumber ?? bb.phone ?? '');
            const email = String(user.email ?? bb.email ?? '');
            const address = String(user.address ?? bb.address ?? '');
            const createdAt = String(bb.created_at ?? bb.createdAt ?? '');
            const createdBy = String(bb.created_by ?? bb.createdBy ?? '');

            return {
              id,
              fullName,
              dateOfBirth,
              gender: gender as Patient['gender'],
              phoneNumber,
              email,
              address,
              medicalHistory,
              createdAt,
              createdBy,
            } as Patient;
          });
          return mapped;
        }
      } catch (err) {
        console.warn('Failed to load backend patients, falling back to mock', err);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      return dynamicPatients;
    },

    createPatient: async (patientData: Omit<Patient, 'id' | 'createdAt' | 'createdBy'>): Promise<{ success: boolean; id: string }> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate new ID
      const existingIds = dynamicPatients.map(p => parseInt(p.id.substring(1)));
      const maxId = Math.max(...existingIds, 0);
      const newId = `P${String(maxId + 1).padStart(3, '0')}`;
      
      // Create new patient
      const newPatient: Patient = {
        ...patientData,
        id: newId,
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'Lab User'
      };
      
      // Add to dynamic list
      dynamicPatients.push(newPatient);
      
      console.log(`[AUDIT] E_00012 | Patient created by Lab User`, patientData);
      console.log(`[AUDIT] New patient added:`, newPatient);
      
      return { success: true, id: newId };
    },

    updatePatient: async (id: string, patientData: Partial<Patient>): Promise<{ success: boolean }> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find and update patient
      const patientIndex = dynamicPatients.findIndex(p => p.id === id);
      if (patientIndex !== -1) {
        dynamicPatients[patientIndex] = {
          ...dynamicPatients[patientIndex],
          ...patientData,
          updatedAt: new Date().toISOString().split('T')[0],
          updatedBy: 'Lab User'
        };
      }
      
      console.log(`[AUDIT] E_00013 | Patient updated by Lab User`, { id, patientData });
      return { success: true };
    },

    getPatientTestOrders: async (patientId: string): Promise<TestOrder[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockTestOrders.filter(order => order.patientId === patientId);
    },

    getPatientAuditLogs: async (patientId: string): Promise<AuditLog[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockAuditLogs.filter(log => log.patientId === patientId);
    }
  };
