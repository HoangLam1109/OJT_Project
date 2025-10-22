import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { HomeLayout } from "../layouts/HomeLayout";
import { LoginLayout } from "../layouts/LoginLayout";
import { RegisterForm } from "../pages/register/RegisterForm";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthContext } from "../hooks/useAuthContext";
import { AdminLayout } from "../layouts/AdminLayout";
import { 
  AdminDashboardPage,
  AdminUserManagementPage,
  AdminPatientManagementPage,
  AdminTestOrderManagementPage,
  AdminAuditReportsPage,
  AdminSettingsPage
} from "../pages/admin";
import { useState } from "react";
import { ManagerUserManagementPage } from "../pages/manager";
import { ManagerLayout } from "../layouts/ManagerLayout";
import NormalUserLayout from "../layouts/NormalUserLayout";
import Dashboard from "../pages/NormalUser/Dashboard";
import TestResults from "../pages/NormalUser/TestResults";
import Profile from "../pages/NormalUser/Profile";

export function AppRoutes() {
  const { user, onLogout } = useAuthContext();
  const navigate = useNavigate();
  const [adminPage, setAdminPage] = useState("dashboard");
  const [managerPage, setManagerPage] = useState("user-management");
  const [normalUserPage, setNormalUserPage] = useState("dashboard");

  return (
    <Routes>
      {/* Trang chủ */}
      <Route     
        path="/"
        element={
          <HomeLayout
            onShowLogin={() => navigate("/login")}
            onShowRegister={() => navigate("/register")}
          />
        }
      />


      {/* Trang đăng nhập */}
      <Route
        path="/login"
        element={
          <LoginLayout/>
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

      {/* Trang Normal User */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <NormalUserLayout
              currentUser={user!}
              onLogout={onLogout}
              currentPage={normalUserPage}
              onNavigate={(page) => setNormalUserPage(page)}
            >
              {normalUserPage === "dashboard" && <Dashboard />}
              {normalUserPage === "test-results" && <TestResults />}
              {normalUserPage === "profile" && <Profile />}
            </NormalUserLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout
              currentUser={user!}
              onLogout={onLogout}
              currentPage={adminPage}
              onNavigate={(page) => setAdminPage(page)} 
            >
              
              {adminPage === "dashboard" && <AdminDashboardPage />}
              {adminPage === "user-management" && <AdminUserManagementPage />}
              {adminPage === "patient-management" && <AdminPatientManagementPage />}
              {adminPage === "test-management" && <AdminTestOrderManagementPage />}
              {adminPage === "audit-reports" && <AdminAuditReportsPage />}
              {adminPage === "settings" && <AdminSettingsPage />}
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Trang Manager */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}>
            <ManagerLayout
              currentUser={user!}
              onLogout={onLogout}
              currentPage={managerPage}
              onNavigate={(page) => setManagerPage(page)}
            >
              {managerPage === "user-management" && <ManagerUserManagementPage currentUser={user!} />}
              {managerPage === "dashboard" && (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900">Dashboard Manager</h2>
                  <p className="text-gray-500 mt-2">Trang tổng quan đang được phát triển</p>
                </div>
              )}
              {managerPage === "settings" && (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900">Cài đặt</h2>
                  <p className="text-gray-500 mt-2">Trang cài đặt đang được phát triển</p>
                </div>
              )}
            </ManagerLayout>
          </ProtectedRoute>
        }
      />
     


      {/* Nếu không khớp route nào thì quay lại Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
