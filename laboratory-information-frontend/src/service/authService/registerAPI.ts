import axios from "axios";
import type { RegisterRequest, RegisterResponse } from "../../pages/register/types/register";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function registerUser(userData: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        message: response.data.message || 'Đăng ký thành công',
        user: response.data.user,

      };
    }

    return {
      success: false,
      message: 'Đăng ký thất bại !',
    };
  } catch (error: unknown) {
    console.error("Register error:", error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đăng ký';
      return {
        success: false,
        message: errorMessage,
      };
    }

    return {
      success: false,
      message: 'Có lỗi xảy ra khi đăng ký',
    };
  }
}
