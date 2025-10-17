import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { HomePage } from "../modules/home/HomeLayout";
import { LoginPage } from "../modules/login/page/LoginPage";
import { RegisterForm } from "../modules/register/pages/RegisterForm";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthContext } from "../modules/login/context/useAuthContext";
import { AdminLayout } from "../modules/admin/layout/AdminLayout";
import { DashboardPage } from "../modules/admin/pages/dashboard/DashboardPage";
import { LabManagerLayout } from "../modules/manager/layout/LabManagerLayout";
import { LabManagerDashboard } from "../modules/manager/pages/LabManagerDashboard";
import { ServiceLayout } from "../modules/actor-service/layout/ServiceLayout";
import { SettingsPage } from "../modules/admin/pages/setting/SettingsPage";
import PatientManagementPage from "../modules/admin/pages/patient-management/PatientManagementPage";
import { AuditReportsPage } from "../modules/admin/pages/audit-reports/AuditReportsPage";
import { useState } from "react";
import { UserManagementPage } from "../modules/admin/pages/user-management/UserManagementPage";
import { TestOrderManagementPage } from "../modules/admin/pages/test-order-management/TestOrderManagementPage";
import { LabUserLayout } from "../modules/labuser/layout/LabUserLayout";
import { NormalUserLayout } from "../modules/normaluser/layout/NormalUserLayout";
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
      <Route
        path="/labmanager"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
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
          <ProtectedRoute allowedRoles={['SERVICE']}>
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

         <Route
        path="/labuser"
        element={
          <ProtectedRoute allowedRoles={['LAB_USER']}>
            <LabUserLayout
              currentUser={user!}
              onLogout={logout}
              currentPage="dashboard"
              onNavigate={(page) => console.log('Navigate to', page)}
            >
            <DashboardPage />
            </LabUserLayout>
          </ProtectedRoute>
        }
      />

           <Route
        path="/normaluser"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <NormalUserLayout
              currentUser={user!}
              onLogout={logout}
              currentPage="dashboard"
              onNavigate={(page) => console.log('Navigate to', page)}
            >
            <DashboardPage />
            </NormalUserLayout>
          </ProtectedRoute>
        }
      />



      {/* Nếu không khớp route nào thì quay lại Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
