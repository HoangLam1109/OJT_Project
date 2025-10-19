import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logoutUser } from "../../service/authService/logoutApi";
import { useAuthContext } from "../../hooks/useAuthContext";

export const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const { onLogout } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (!confirmed) return;

    try {
      setLoading(true);
      const success = await logoutUser();

      if (success) {
        onLogout(); 
        toast.success("Đăng xuất thành công!");
        navigate("/login");
      } else {
        toast.error("Đăng xuất thất bại!");
      }
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
