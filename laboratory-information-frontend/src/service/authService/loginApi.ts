
import { apiService, apiUtils } from "../apiClient";
import type { User } from "../../types/User";
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const response = await apiService.post<{ user: User }>("/login", { email, password });
    if (response?.user) {
      // mapping dữ liệu backend trả về sang frontend
      const backendUser = response.user;
      const user: User = {
        id: backendUser.id ,
        name:  backendUser.name,
        email: backendUser.email,
        role: backendUser.role,
        active: true,
        permissions: [], // nếu có thể thêm sau
      };
      return user;
    }
    return null; 
  } catch (error: unknown) {
    console.error("Login error:", apiUtils.getErrorMessage(error));
    return null;
  }
}