import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { HomePage } from "../pages/home/HomeLayout";
import { LoginPage } from "../features/login/pages/LoginPage";
import { RegisterForm } from "../features/register/components/RegisterForm";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthContext } from "../features/login/context/useAuthContext";
import { AdminLayout } from "../layouts/AdminLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { LabManagerLayout } from "../layouts/LabManagerLayout";
import { LabManagerDashboard } from "../pages/LabManagerDashboard";
import { ServiceLayout } from "../layouts/ServiceLayout";
import { SettingsPage } from "../pages/SettingsPage";
export function AppRoutes() {
  const { user, login, logout } = useAuthContext();
  const navigate = useNavigate(); // ✅ hook điều hướng

  return (
    <Routes>
      {/* Trang chủ */}
      <Route
        path="/"
        element={
          <HomePage
            onShowLogin={() => navigate("/login")}
            onShowRegister={() => navigate("/register")}
          />
        }
      />


      {/* Trang đăng nhập */}
      <Route
        path="/login"
        element={
          <LoginPage
            onLogin={login}
            onShowForgotPassword={() => alert("Tính năng đang phát triển")}
            onBackToHome={() => navigate("/")}
            onShowRegister={() => navigate("/register")}
          />
        }
      />

      {/* Trang đăng ký */}
      <Route
        path="/register"
        element={
          <RegisterForm
            onBackToLogin={() => navigate("/login")}
            onBackToHome={() => navigate("/")}
          />}
      />

      {/* Route được bảo vệ */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout
              currentUser={user!}
              onLogout={logout}
              currentPage="dashboard"
              onNavigate={(page) => console.log('Navigate to', page)}
            >
              {/* Nội dung dashboard */}
              <DashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/labmanager"
        element={
          <ProtectedRoute allowedRoles={['laboratory_manager']}>
            <LabManagerLayout
              currentUser={user!}
              onLogout={logout}
              currentPage="dashboard"
              onNavigate={(page) => console.log('Navigate to', page)}
            >
              <LabManagerDashboard />
            </LabManagerLayout>
          </ProtectedRoute>
        }
      />
      
        <Route
        path="/service"
        element={
          <ProtectedRoute allowedRoles={['service']}>
            <ServiceLayout
              currentUser={user!}
              onLogout={logout}
              currentPage="dashboard"
              onNavigate={(page) => console.log('Navigate to', page)}
            >
              <SettingsPage  currentUser={user!}/>
            </ServiceLayout>
          </ProtectedRoute>
        }
      />


      {/* Nếu không khớp route nào thì quay lại Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
