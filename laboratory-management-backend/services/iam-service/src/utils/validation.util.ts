import { isValidRoleCode } from "../constants/roles.constant.js";

export const validateRole = (value: string): boolean => {
  return isValidRoleCode(value);
};

export const roleValidationMessages = {
  'any.invalid': 'Invalid role code'
};