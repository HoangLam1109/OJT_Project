
import type { UserFormData, ValidationErrors } from './ManagerTypes';

// Validate Email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate Phone (accepts +84, numbers, spaces, dashes)
export function isValidPhone(phone: string): boolean {
  return /^[0-9+\-\s()]+$/.test(phone);
}

// Validate Password
export function validatePassword(password: string): string {
  if (password.length === 0) return 'Mật khẩu là bắt buộc';
  if (password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
  if (password.length > 12) return 'Mật khẩu không được vượt quá 12 ký tự';
  if (!/[A-Z]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ hoa';
  if (!/[a-z]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ thường';
  if (!/\d/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ số';
  return '';
}

export function isValidIdentifyNumber(identify_number: string): boolean {
  return /^\d+$/.test(identify_number);
}

export function validateUserForm(formData: UserFormData, mode: 'create' | 'edit' | 'view'): ValidationErrors {
  const errors: ValidationErrors = {};

  if (mode === 'view') return errors;

  if (!formData.fullName?.trim()) {
    errors.fullName = 'Họ tên là bắt buộc';
  }

  if (!formData.email?.trim()) {
    errors.email = 'Email là bắt buộc';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (mode === 'create' || (formData.password && formData.password.length > 0)) {
    const passwordError = validatePassword(formData.password || "");

    if (passwordError) errors.password = passwordError;
  }

  if (!formData.phone_number?.trim()) {
    errors.phone_number = 'Số điện thoại là bắt buộc';
  } else if (!isValidPhone(formData.phone_number)) {
    errors.phone_number = 'Số điện thoại không hợp lệ';
  }

   if (!formData.identify_number?.trim()) {
    errors.identify_number = 'Số CMND/CCCD là bắt buộc';
  } else if (!isValidIdentifyNumber(formData.identify_number)) {
    errors.identify_number = 'CMND/CCCD chỉ được chứa số';
  }

  if (!formData.date_of_birth) {
    errors.date_of_birth = 'Ngày sinh là bắt buộc';
  }

  return errors;
}
