import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async (): Promise<void> => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/api/logout",
        {},
        { withCredentials: true }
      );

      // Nếu backend trả về 204 (No Content), coi là thành công
      if (response.status === 204 || response.status === 200) {
        localStorage.removeItem("user");
        toast.success("Đăng xuất thành công!");
        navigate("/login");
      } else {
        toast.error("Đăng xuất thất bại!");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Đăng xuất thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition disabled:opacity-60"
    >
      {loading ? "Đang đăng xuất..." : "Logout"}
    </button>
  );
};
