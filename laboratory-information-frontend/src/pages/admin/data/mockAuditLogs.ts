export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit001',
    userId: 'usr001',
    userName: 'TS. Sarah Wilson',
    userRole: 'ADMIN',
    action: 'LOGIN',
    resource: 'Authentication',
    details: 'User logged in successfully',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-10-21T09:30:00Z',
    status: 'success',
    severity: 'low'
  },
  {
    id: 'audit002',
    userId: 'usr001',
    userName: 'TS. Sarah Wilson',
    userRole: 'ADMIN',
    action: 'CREATE',
    resource: 'User',
    resourceId: 'usr006',
    details: 'Created new user account for CN. John Doe',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-10-21T10:15:00Z',
    status: 'success',
    severity: 'medium'
  },
  {
    id: 'audit003',
    userId: 'usr002',
    userName: 'CN. Lisa Chen',
    userRole: 'LAB_USER',
    action: 'UPDATE',
    resource: 'TestResult',
    resourceId: 'res001',
    details: 'Updated test result for patient Nguyễn Văn An',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    timestamp: '2024-10-21T11:20:00Z',
    status: 'success',
    severity: 'medium'
  },
  {
    id: 'audit004',
    userId: 'usr003',
    userName: 'ThS. David Kim',
    userRole: 'MANAGER',
    action: 'DELETE',
    resource: 'TestOrder',
    resourceId: 'ord005',
    details: 'Cancelled test order for patient Hoàng Văn Ích',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-10-21T12:00:00Z',
    status: 'success',
    severity: 'high'
  },
  {
    id: 'audit005',
    userId: 'usr001',
    userName: 'TS. Sarah Wilson',
    userRole: 'ADMIN',
    action: 'LOGIN_FAILED',
    resource: 'Authentication',
    details: 'Failed login attempt with invalid credentials',
    ipAddress: '192.168.1.200',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-10-21T13:45:00Z',
    status: 'failed',
    severity: 'medium'
  },
  {
    id: 'audit006',
    userId: 'usr002',
    userName: 'CN. Lisa Chen',
    userRole: 'LAB_USER',
    action: 'VIEW',
    resource: 'Patient',
    resourceId: 'pat001',
    details: 'Viewed patient record for Nguyễn Văn An',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    timestamp: '2024-10-21T14:30:00Z',
    status: 'success',
    severity: 'low'
  },
  {
    id: 'audit007',
    userId: 'usr004',
    userName: 'KS. Mike Johnson',
    userRole: 'SERVICE',
    action: 'SYSTEM_CONFIG',
    resource: 'System',
    details: 'Updated system configuration settings',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-10-21T15:15:00Z',
    status: 'success',
    severity: 'high'
  },
  {
    id: 'audit008',
    userId: 'usr001',
    userName: 'TS. Sarah Wilson',
    userRole: 'ADMIN',
    action: 'EXPORT',
    resource: 'Report',
    details: 'Exported patient data report',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-10-21T16:00:00Z',
    status: 'success',
    severity: 'medium'
  },
  {
    id: 'audit009',
    userId: 'usr002',
    userName: 'CN. Lisa Chen',
    userRole: 'LAB_USER',
    action: 'CRITICAL_RESULT',
    resource: 'TestResult',
    resourceId: 'res004',
    details: 'Flagged critical result for patient Phạm Thị Gia',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    timestamp: '2024-10-21T16:30:00Z',
    status: 'warning',
    severity: 'critical'
  },
  {
    id: 'audit010',
    userId: 'usr003',
    userName: 'ThS. David Kim',
    userRole: 'MANAGER',
    action: 'LOGOUT',
    resource: 'Authentication',
    details: 'User logged out successfully',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-10-21T17:00:00Z',
    status: 'success',
    severity: 'low'
  }
];
