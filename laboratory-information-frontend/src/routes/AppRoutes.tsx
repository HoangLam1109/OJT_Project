import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { HomePage } from "../layouts/HomeLayout";
import { LoginPage } from "../layouts/LoginLayout";
import { RegisterForm } from "../pages/register/RegisterForm";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthContext } from "../context/types/useAuthContext";
import { AdminLayout } from "../layouts/AdminLayout";
import { DashboardPage } from "../pages/admin/DashboardPage";

import { SettingsPage} from "../pages/admin/SettingsPage";
import PatientManagementPage from "../pages/admin/PatientManagementPage";
import { AuditReportsPage } from "../pages/admin/AuditReportsPage";
import { useState } from "react";
import { UserManagementPage } from "../pages/admin/UserManagementPage";
import { TestOrderManagementPage } from "../pages/admin/TestOrderManagementPage";

export function AppRoutes() {
  const { user, login, logout } = useAuthContext();
  const navigate = useNavigate();
  const [adminPage, setAdminPage] = useState("dashboard");

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

      
        <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout
              currentUser={user!}
              onLogout={logout}
              currentPage={adminPage}
              onNavigate={(page) => setAdminPage(page)} 
            >
              
              {adminPage === "dashboard" && <DashboardPage />}
              {adminPage === "user-management" && <UserManagementPage  currentUser={user!}/>}
              {adminPage === "patient-management" && <PatientManagementPage />}
              {adminPage === "test-management" && <TestOrderManagementPage currentUser={user!} />}
              {adminPage === "audit-reports" && <AuditReportsPage />}
              {adminPage === "settings" && <SettingsPage currentUser={user!} />}
            </AdminLayout>
          </ProtectedRoute>
        }
      />
     


      {/* Nếu không khớp route nào thì quay lại Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
