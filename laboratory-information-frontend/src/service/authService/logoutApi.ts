
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

export async function logoutUser(): Promise<boolean> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/logout`,
      {},
      { withCredentials: true }
    );

    // Nếu backend trả về 204 hoặc 200 → thành công
    if (response.status === 204 || response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
}
