
import { apiService, apiUtils } from "../apiClient";
import type { User } from "../../types/User";
export async function authenticateUser(identifier: string, password: string): Promise<User | null> {
  try {
    console.log("Sending:", { identifier, password });

    const response = await apiService.post<{ user: User }>("/login", { identifier, password });
    if (response?.user) {
      // mapping dữ liệu backend trả về sang frontend
      const backendUser = response.user;
      console.log('Backend user response:', backendUser); // Debug log
      
      const user: User = {
        id: backendUser.id || '',
        name: backendUser.name || "Unnamed User",
        email: backendUser.email || '',
        role: backendUser.role || 'USER',
        active: backendUser.active !== undefined ? backendUser.active : true,
        permissions: backendUser.permissions || [],
        phone_number: backendUser.phone_number || '',
        identify_number: backendUser.identify_number || '',
        gender: backendUser.gender,
        age: backendUser.age,
        address: backendUser.address,
        date_of_birth: backendUser.date_of_birth || '',
      };
      
      console.log('Mapped user:', user); // Debug log
      return user;
    }
    return null; 
  } catch (error: unknown) {
    console.error("Login error:", apiUtils.getErrorMessage(error));
    return null;
  }
}