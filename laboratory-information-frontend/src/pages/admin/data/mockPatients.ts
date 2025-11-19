export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone: string;
  identifyNumber: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  age: number;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  allergies: string[];
  bloodType: string;
  status: 'active' | 'inactive' | 'deceased';
  createdAt: string;
  updatedAt: string;
  lastVisit?: string;
}

// export const mockPatients: Patient[] = [
//   {
//     id: 'pat001',
//     name: 'Nguyễn Văn An',
//     email: 'an.nguyen@email.com',
//     phone: '+84-901-234-567',
//     identifyNumber: '079089001234',
//     gender: 'male',
//     dateOfBirth: '1985-03-15',
//     age: 39,
//     address: '123 Đường Láng, Đống Đa, Hà Nội',
//     emergencyContact: {
//       name: 'Nguyễn Thị Bình',
//       phone: '+84-902-345-678',
//       relationship: 'Vợ'
//     },
//     medicalHistory: ['Tiểu đường type 2', 'Cao huyết áp'],
//     allergies: ['Penicillin', 'Sulfa'],
//     bloodType: 'A+',
//     status: 'active',
//     createdAt: '2024-01-15T08:30:00Z',
//     updatedAt: '2024-10-21T10:15:00Z',
//     lastVisit: '2024-10-20T14:30:00Z'
//   },
//   {
//     id: 'pat002',
//     name: 'Trần Thị Cường',
//     email: 'cuong.tran@email.com',
//     phone: '+84-903-456-789',
//     identifyNumber: '079089002345',
//     gender: 'female',
//     dateOfBirth: '1992-07-22',
//     age: 32,
//     address: '456 Nguyễn Trãi, Thanh Xuân, Hà Nội',
//     emergencyContact: {
//       name: 'Trần Văn Dũng',
//       phone: '+84-904-567-890',
//       relationship: 'Anh trai'
//     },
//     medicalHistory: ['Thiếu máu'],
//     allergies: ['Không có'],
//     bloodType: 'B+',
//     status: 'active',
//     createdAt: '2024-02-20T09:15:00Z',
//     updatedAt: '2024-10-21T11:20:00Z',
//     lastVisit: '2024-10-18T09:00:00Z'
//   },
//   {
//     id: 'pat003',
//     name: 'Lê Văn Em',
//     email: 'em.le@email.com',
//     phone: '+84-905-678-901',
//     identifyNumber: '079089003456',
//     gender: 'male',
//     dateOfBirth: '1978-11-10',
//     age: 45,
//     address: '789 Trần Duy Hưng, Cầu Giấy, Hà Nội',
//     emergencyContact: {
//       name: 'Lê Thị Phương',
//       phone: '+84-906-789-012',
//       relationship: 'Vợ'
//     },
//     medicalHistory: ['Viêm gan B', 'Suy thận mạn'],
//     allergies: ['Aspirin'],
//     bloodType: 'O+',
//     status: 'active',
//     createdAt: '2024-03-10T14:45:00Z',
//     updatedAt: '2024-10-21T08:30:00Z',
//     lastVisit: '2024-10-19T16:00:00Z'
//   },
//   {
//     id: 'pat004',
//     name: 'Phạm Thị Gia',
//     email: 'gia.pham@email.com',
//     phone: '+84-907-890-123',
//     identifyNumber: '079089004567',
//     gender: 'female',
//     dateOfBirth: '1995-05-18',
//     age: 29,
//     address: '321 Giải Phóng, Hai Bà Trưng, Hà Nội',
//     emergencyContact: {
//       name: 'Phạm Văn Hùng',
//       phone: '+84-908-901-234',
//       relationship: 'Chồng'
//     },
//     medicalHistory: ['Hen suyễn'],
//     allergies: ['Bụi', 'Phấn hoa'],
//     bloodType: 'AB+',
//     status: 'active',
//     createdAt: '2024-04-05T11:20:00Z',
//     updatedAt: '2024-10-21T13:45:00Z',
//     lastVisit: '2024-10-17T10:30:00Z'
//   },
//   {
//     id: 'pat005',
//     name: 'Hoàng Văn Ích',
//     email: 'ich.hoang@email.com',
//     phone: '+84-909-012-345',
//     identifyNumber: '079089005678',
//     gender: 'male',
//     dateOfBirth: '1988-09-05',
//     age: 36,
//     address: '654 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
//     emergencyContact: {
//       name: 'Hoàng Thị Kim',
//       phone: '+84-910-123-456',
//       relationship: 'Chị gái'
//     },
//     medicalHistory: ['Không có'],
//     allergies: ['Không có'],
//     bloodType: 'A-',
//     status: 'inactive',
//     createdAt: '2024-05-12T16:30:00Z',
//     updatedAt: '2024-09-15T12:00:00Z',
//     lastVisit: '2024-09-10T14:15:00Z'
//   }
// ];
