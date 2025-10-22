import { apiService, apiUtils } from "../apiClient";
import type { RegisterRequest, RegisterResponse } from "../../pages/register/types/register";

export async function registerUser(userData: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await apiService.post<{ message: string; user: any }>("/register", userData);

    if (response) {
      return {
        success: true,
        message: response.message || 'Đăng ký thành công',
        user: response.user,
      };
    }

    return {
      success: false,
      message: 'Đăng ký thất bại !',
    };
  } catch (error: unknown) {
    console.error("Register error:", apiUtils.getErrorMessage(error));
    
    const errorMessage = apiUtils.getErrorMessage(error) || 'Có lỗi xảy ra khi đăng ký';
    return {
      success: false,
      message: errorMessage,
    };
  }
}
