export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: "Nam" | "Nữ" | "Khác";
  dateOfBirth: string;
  department: string;
  role: string;
  avatar: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: number;
  action: string;
  code: string;
  status: string;
  time: string;
  details?: string;
}

export const mockUserProfile: UserProfile = {
  id: "USR-012",
  name: "Nguyễn Văn B",
  email: "nguyenb@labcare.vn",
  phone: "0901234567",
  gender: "Nam",
  dateOfBirth: "1995-05-12",
  department: "Phòng Xét nghiệm Sinh hóa",
  role: "Lab User",
  avatar: "/assets/avatar-default.png",
  lastLogin: "2025-10-22 08:30",
  createdAt: "2023-01-15T09:00:00Z",
  updatedAt: "2025-10-22T09:15:00Z"
};

export const mockAuditLogs: AuditLog[] = [
  {
    id: 1,
    action: "Đăng nhập hệ thống",
    code: "E_00011",
    status: "Thành công",
    time: "2025-10-22 08:30",
    details: "Đăng nhập thành công từ IP 192.168.1.100"
  },
  {
    id: 2,
    action: "Cập nhật hồ sơ",
    code: "E_00012",
    status: "Hoàn tất",
    time: "2025-10-22 09:00",
    details: "Cập nhật thông tin số điện thoại"
  },
  {
    id: 3,
    action: "Đổi mật khẩu",
    code: "E_00014",
    status: "Hoàn tất",
    time: "2025-10-22 09:15",
    details: "Thay đổi mật khẩu thành công"
  },
  {
    id: 4,
    action: "Cập nhật hồ sơ",
    code: "E_00012",
    status: "Hoàn tất",
    time: "2025-10-21 14:30",
    details: "Cập nhật thông tin địa chỉ"
  },
  {
    id: 5,
    action: "Đăng nhập hệ thống",
    code: "E_00011",
    status: "Thành công",
    time: "2025-10-21 08:00",
    details: "Đăng nhập thành công từ IP 192.168.1.100"
  },
  {
    id: 6,
    action: "Cập nhật hồ sơ",
    code: "E_00012",
    status: "Hoàn tất",
    time: "2025-10-20 16:45",
    details: "Cập nhật ảnh đại diện"
  },
  {
    id: 7,
    action: "Đăng nhập hệ thống",
    code: "E_00011",
    status: "Thành công",
    time: "2025-10-20 08:15",
    details: "Đăng nhập thành công từ IP 192.168.1.100"
  },
  {
    id: 8,
    action: "Đổi mật khẩu",
    code: "E_00014",
    status: "Hoàn tất",
    time: "2025-10-19 10:20",
    details: "Thay đổi mật khẩu thành công"
  }
];
