import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { logoutUser } from "../../service/authService/logoutApi";
import { useAuthContext } from "../../hooks/useAuthContext";

interface LogoutButtonProps {
  collapsed?: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ collapsed = false }) => {
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
      className={`rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition disabled:opacity-60 ${
        collapsed 
          ? 'p-2 w-full flex items-center justify-center' 
          : 'px-4 py-2'
      }`}
      title={collapsed ? (loading ? "Đang đăng xuất..." : "Đăng xuất") : undefined}
    >
      {collapsed ? (
        <LogOut className="h-4 w-4" />
      ) : (
        loading ? "Đang đăng xuất..." : "Đăng xuất"
      )}
    </button>
  );
};
