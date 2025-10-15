// Audit Log Event Constants
export const AUDIT_EVENT_CODES = [
  'E_00001', 'E_00002', 'E_00003', 'E_00004', 'E_00005',
  'E_00006', 'E_00007', 'E_00008', 'E_00009', 'E_00010', 'E_00011'
] as const;

export const AUDIT_ACTIONS = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'LOGIN',
  'LOGOUT',
  'LOCK',
  'UNLOCK',
  'SYNC',
  'HEALTH_CHECK'
] as const;

// Type definitions for better type safety
export type AuditEventCode = typeof AUDIT_EVENT_CODES[number];
export type AuditAction = typeof AUDIT_ACTIONS[number];

// Event code descriptions for documentation
export const EVENT_CODE_DESCRIPTIONS: Record<AuditEventCode, string> = {
  'E_00001': 'User registration',
  'E_00002': 'User login',
  'E_00003': 'User logout',
  'E_00004': 'Password change',
  'E_00005': 'Profile update',
  'E_00006': 'Account deletion',
  'E_00007': 'Failed login attempt',
  'E_00008': 'Account lockout',
  'E_00009': 'Data synchronization',
  'E_00010': 'User lock/unlock',
  'E_00011': 'System health check'
};