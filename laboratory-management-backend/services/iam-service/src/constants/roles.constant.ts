
export const ROLE_CODES = {
  ADMIN: 'ADMIN',
  LAB_MANAGER: 'LAB_MANAGER',
  SERVICE: 'SERVICE',
  LAB_USER: 'LAB_USER',
  USER: 'USER'
} as const

export type RoleCode = typeof ROLE_CODES[keyof typeof ROLE_CODES]

export const ROLE_DESCRIPTIONS = {
  [ROLE_CODES.ADMIN]: 'System Administrator with full access to all features',
  [ROLE_CODES.LAB_MANAGER]: 'Laboratory Manager with access to lab management features',
  [ROLE_CODES.SERVICE]: 'Service personnel with access to service-related features',
  [ROLE_CODES.LAB_USER]: 'Laboratory User with access to basic lab functionality',
  [ROLE_CODES.USER]: 'User with access to basic user functionality'
} as const

export const ROLE_NAMES = {
  [ROLE_CODES.ADMIN]: 'Administrator',
  [ROLE_CODES.LAB_MANAGER]: 'Lab Manager',
  [ROLE_CODES.SERVICE]: 'Service',
  [ROLE_CODES.LAB_USER]: 'Lab User',
  [ROLE_CODES.USER]: 'User'
} as const

export function isValidRoleCode(roleCode: string): roleCode is RoleCode {
  return Object.values(ROLE_CODES).includes(roleCode as RoleCode)
}

export function getRoleDescription(roleCode: RoleCode): string {
  return ROLE_DESCRIPTIONS[roleCode] || 'No description available'
}

export function getRoleName(roleCode: RoleCode): string {
  return ROLE_NAMES[roleCode] || roleCode
}

export const SYSTEM_ROLES = [
  ROLE_CODES.ADMIN,
  ROLE_CODES.LAB_MANAGER,
  ROLE_CODES.SERVICE,
  ROLE_CODES.LAB_USER,
  ROLE_CODES.USER
] as const

export function isSystemRole(roleCode: RoleCode): boolean {
  return SYSTEM_ROLES.includes(roleCode as any)
}
