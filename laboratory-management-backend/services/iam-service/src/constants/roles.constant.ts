export const ROLE_CODES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  SERVICE: "SERVICE",
  LAB_USER: "LAB_USER",
  USER: "USER",
} as const;

export const ROLE_PERMISSIONS: Record<RoleCode, string[]> = {
  [ROLE_CODES.ADMIN]: ["*"],
  [ROLE_CODES.MANAGER]: ["read:users", "manage:users"],
  [ROLE_CODES.SERVICE]: ["read:configurations", "manage:configurations"],
  [ROLE_CODES.LAB_USER]: ["read:tests", "manage:tests", "read:comments", "manage:comments"],
  [ROLE_CODES.USER]: ["read:tests"],
};

export type RoleCode = (typeof ROLE_CODES)[keyof typeof ROLE_CODES];

export function isValidRoleCode(roleCode: string): boolean {
  return /^[A-Z0-9_]{2,30}$/.test(roleCode);
}
