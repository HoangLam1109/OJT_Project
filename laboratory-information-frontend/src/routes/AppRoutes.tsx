import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { HomeLayout } from "../layouts/HomeLayout";
import { LoginLayout } from "../layouts/LoginLayout";
import { RegisterPage } from "../pages/register/RegisterPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthContext } from "../hooks/useAuthContext";
import { AdminLayout } from "../layouts/AdminLayout";
import {
  AdminDashboardPage,
  AdminPatientManagementPage,
  AdminAuditReportsPage,
  AdminProfilePage
} from "../pages/admin";
import { useState } from "react";
import { ManagerUserManagementPage } from "../pages/manager";
import { ManagerLayout } from "../layouts/ManagerLayout";
import NormalUserLayout from "../layouts/NormalUserLayout";
import Dashboard from "../pages/NormalUser/Dashboard";
import TestResults from "../pages/NormalUser/TestResults";
import ChatPage from "../pages/NormalUser/ChatPage";
import Profile from "../layouts/Profile";
import LabUserDashboard from "../pages/LabUser/Dashboard";
import TestOrdersPage from "../pages/LabUser/TestOrdersPage";
import CreateTestOrderPage from "../pages/LabUser/CreateTestOrderPage";
import SelectInstrumentsPage from "../pages/LabUser/SelectInstrumentsPage";
import SelectReagentsPage from "../pages/LabUser/SelectReagentsPage";
import { LabUserRouteWrapper } from "./LabUserRouteWrapper";
import { LabUserRouteElement } from "./LabUserRouteElement";
import TestResultsPage from "../pages/LabUser/TestResultsPage";
import InstrumentManagementPage from "../pages/LabUser/InstrumentManagementPage";
import ReagentManagementPage from "../pages/LabUser/ReagentManagementPage";
import { ServiceLayout } from "../layouts/ServiceLayout";
import ServiceDashboardPage from "../pages/service/ServiceDashboardPage";
import ServiceEventLogPage from "../pages/service/ServiceEventLogPage";
import ServiceReagentPage from "../pages/service/ServiceReagentPage";
import ServiceInstrumentPage from "../pages/service/ServiceInstrumentPage";
import { GoogleCallbackPage } from "../pages/login/GoogleCallbackPage";
import { TestOrderActionsProvider } from "../context/TestOrderActionsContext";

export function AppRoutes() {
  const { user, onLogout } = useAuthContext();
  const navigate = useNavigate();
  const [adminPage, setAdminPage] = useState("dashboard");
  const [managerPage, setManagerPage] = useState("user-management");
  const [normalUserPage, setNormalUserPage] = useState("dashboard");
  const [labUserPage, setLabUserPage] = useState("dashboard");
  const [servicePage, setServicePage] = useState("dashboard");

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
          <LoginLayout />
        }
      />

      {/* Trang đăng ký */}
      <Route
        path="/register"
        element={<RegisterPage />}
      />

      {/* Google OAuth Callback */}
      <Route
        path="/auth/google/callback"
        element={<GoogleCallbackPage />}
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
              {normalUserPage === "chat" && <ChatPage />}
              {normalUserPage === "profile" && <Profile currentUser={user!} />}
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
              {adminPage === "user-management" && <ManagerUserManagementPage />}
              {adminPage === "patient-management" && <AdminPatientManagementPage />}
              {adminPage === "test-orders" && (
                <TestOrderActionsProvider>
                  <TestOrdersPage />
                </TestOrderActionsProvider>
              )}
              {adminPage === "audit-reports" && <AdminAuditReportsPage />}
              {adminPage === "profile" && <AdminProfilePage />}
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
              {managerPage === "user-management" && <ManagerUserManagementPage />}
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
              {managerPage === "instruments" && <InstrumentManagementPage />}
              {managerPage === "profile" && <Profile currentUser={user!} />}
            </ManagerLayout>
          </ProtectedRoute>
        }
      />

      {/* Trang Lab User */}
      <Route
        path="/labuser"
        element={
          <ProtectedRoute allowedRoles={["LAB_USER"]}>
            <LabUserRouteElement
              currentUser={user!}
              onLogout={onLogout}
              currentPage={labUserPage}
              onNavigate={(page) => setLabUserPage(page)}
              setLabUserPage={setLabUserPage}
            >
              {labUserPage === "dashboard" && <LabUserDashboard />}
              {labUserPage === "patients" && <AdminPatientManagementPage />}
              {labUserPage === "test-orders" && <TestOrdersPage />}
              {labUserPage === "test-results" && <TestResultsPage />}
              {labUserPage === "instruments" && <InstrumentManagementPage />}
              {labUserPage === "reagents" && <ReagentManagementPage />}
              {labUserPage === "reports" && (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900">Báo cáo</h2>
                  <p className="text-gray-500 mt-2">Trang báo cáo đang được phát triển</p>
                </div>
              )}
              {labUserPage === "profile" && <Profile currentUser={user!} />}
            </LabUserRouteElement>
          </ProtectedRoute>
        }
      />

      {/* Trang tạo lệnh xét nghiệm */}
      <Route
        path="/labuser/create-test-order"
        element={
          <ProtectedRoute allowedRoles={["LAB_USER"]}>
            <LabUserRouteWrapper
              currentUser={user!}
              onLogout={onLogout}
              currentPage="test-orders"
              onNavigate={(page) => {
                setLabUserPage(page);
                navigate(`/labuser`);
              }}
            >
              <CreateTestOrderPage />
            </LabUserRouteWrapper>
          </ProtectedRoute>
        }
      />

      {/* Trang chọn thiết bị */}
      <Route
        path="/labuser/select-instruments"
        element={
          <ProtectedRoute allowedRoles={["LAB_USER"]}>
            <LabUserRouteWrapper
              currentUser={user!}
              onLogout={onLogout}
              currentPage="test-orders"
              onNavigate={(page) => {
                setLabUserPage(page);
                navigate(`/labuser`);
              }}
            >
              <SelectInstrumentsPage />
            </LabUserRouteWrapper>
          </ProtectedRoute>
        }
      />

      {/* Trang chọn thuốc thử */}
      <Route
        path="/labuser/select-reagents"
        element={
          <ProtectedRoute allowedRoles={["LAB_USER"]}>
            <LabUserRouteWrapper
              currentUser={user!}
              onLogout={onLogout}
              currentPage="test-orders"
              onNavigate={(page) => {
                setLabUserPage(page);
                navigate(`/labuser`);
              }}
            >
              <SelectReagentsPage />
            </LabUserRouteWrapper>
          </ProtectedRoute>
        }
      />


      {/* Trang Service */}
      <Route
        path="/service"
        element={
          <ProtectedRoute allowedRoles={["SERVICE"]}>
            <ServiceLayout
              currentUser={user!}
              onLogout={onLogout}
              currentPage={servicePage}
              onNavigate={(page) => setServicePage(page)}
            >
              {servicePage === "dashboard" && <ServiceDashboardPage />}
              {servicePage === "event-logs" && <ServiceEventLogPage />}
              {servicePage === "reagents" && <ServiceReagentPage />}
              {servicePage === "instruments" && <ServiceInstrumentPage />}
              {servicePage === "test-orders" && (
                <TestOrderActionsProvider>
                  <TestOrdersPage />
                </TestOrderActionsProvider>
              )}
              {servicePage === "profile" && <Profile currentUser={user!} />}
            </ServiceLayout>
          </ProtectedRoute>
        }
      />


      {/* Nếu không khớp route nào thì quay lại Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
