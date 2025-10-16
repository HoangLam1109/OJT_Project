import axios from "axios";
import type { User } from "../types/User";

const API_BASE_URL = "http://localhost:3000/api";

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password }, {
      withCredentials: true, // để gửi cookie JWT nếu có
    });

    if (response.status === 200 && response.data?.user) {
      // mapping dữ liệu backend trả về sang frontend
      const backendUser = response.data.user;
      const user: User = {
        id: backendUser.id || backendUser._id,
        name: backendUser.fullName || backendUser.name,
        email: backendUser.email,
        role: backendUser.role,
        active: true,
        permissions: [], // nếu có thể thêm sau
      };
      return user;
    }

    return null;
  } catch (error: unknown) {
    // Kiểm tra kiểu error trước khi dùng
    if (error instanceof Error) {
      console.error("Login error:", error.message);
    } else if (axios.isAxiosError(error)) {
      console.error("Login error:", error.response?.data || error.message);
    } else {
      console.error("Login error:", error);
    }
    return null;
  }

}
