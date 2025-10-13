import type { User } from "./User";

/** Props dùng cho LoginForm và LoginPage */
export interface LoginFormProps {
  /** Khi đăng nhập thành công */
  onLogin: (user: User) => void;

  /** Khi người dùng nhấn "Quên mật khẩu?" */
  onShowForgotPassword: () => void;

  /** Khi người dùng nhấn "Quay lại trang chủ" */
  onBackToHome: () => void;

  /** Khi người dùng nhấn "Đăng ký ngay" */
  onShowRegister: () => void;
}
