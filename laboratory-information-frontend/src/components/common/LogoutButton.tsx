import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { logoutUser } from "../../service/authService/logoutApi";
import { useAuthContext } from "../../hooks/useAuthContext";
import { LogoutConfirmDialog } from "./LogoutConfirmDialog";

interface LogoutButtonProps {
  collapsed?: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const { onLogout } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleLogout = async () => {
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
      setShowDialog(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
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

      <LogoutConfirmDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onConfirm={handleLogout}
        loading={loading}
      />
    </>
  );
};
