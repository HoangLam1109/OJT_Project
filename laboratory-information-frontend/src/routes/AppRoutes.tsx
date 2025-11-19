import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ReactNode, ComponentType, ReactElement } from "react";
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
import { ManagerUserManagementPage } from "../pages/manager";
import { ManagerLayout } from "../layouts/ManagerLayout";
import NormalUserLayout from "../layouts/NormalUserLayout";
import Dashboard from "../pages/NormalUser/Dashboard";
import TestResults from "../pages/NormalUser/TestResults";
import ChatPage from "../pages/NormalUser/ChatPage";
import ChatRoomPage from "../pages/NormalUser/ChatRoomPage";
import Profile from "../layouts/Profile";
import LabUserDashboard from "../pages/LabUser/Dashboard";
import TestOrdersPage from "../pages/LabUser/TestOrdersPage";
import CreateTestOrderPage from "../pages/LabUser/CreateTestOrderPage";
import SelectReagentsPage from "../pages/LabUser/SelectReagentsPage";
import { LabUserLayout } from "../layouts/LabUserLayout";
import TestResultsPage from "../pages/LabUser/TestResultsPage";
import ReagentManagementPage from "../pages/LabUser/ReagentManagementPage";
import { ServiceLayout } from "../layouts/ServiceLayout";
import ServiceDashboardPage from "../pages/service/ServiceDashboardPage";
import ServiceInstrumentPage from "../pages/service/ServiceInstrumentPage";
import { GoogleCallbackPage } from "../pages/login/GoogleCallbackPage";
import { ForgotPasswordPage } from "../pages/login/ForgotPasswordPage";
import { ForgotPasswordSuccessPage } from "../pages/login/ForgotPasswordSuccessPage";
import { ResetPasswordPage } from "../pages/login/ResetPasswordPage";
import SelectInstrumentsPage from "@/pages/LabUser/SelectInstrumentsPage"
import PatientDetailPage from "@/pages/LabUser/PatientDetailPage";
import EventLogDetailPage from "@/pages/admin/EventLogDetailPage";
import type { User } from "../types/User";
import LabUserChatPage from "../pages/LabUser/ChatPage";

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Props interface cho layout components
 */
interface LayoutProps {
  currentUser: User;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  children?: ReactNode;
}


/**
 * Cấu hình cho một page con trong role routes
 */
interface PageConfig {
  /** Path của page (ví dụ: "dashboard", "test-orders") */
  path: string;
  /** Component của page */
  // Dùng generic component với props tự do (React.FC<any>) vì nhiều page không có props cụ thể
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  /** Wrapper component tùy chọn */
  wrapper?: ComponentType<{ children: ReactNode }>;
  /** Props tùy chọn để truyền vào component */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentProps?: Record<string, any>;
}

/**
 * Cấu hình cho một role route
 */
interface RoleRouteConfig {
  /** Base path (ví dụ: "/admin", "/labuser") */
  basePath: string;
  /** Roles được phép truy cập */
  allowedRoles: string[];
  /** Layout component */
  Layout: ComponentType<LayoutProps>;
  /** Default page khi truy cập base path */
  defaultPage: string;
  /** Danh sách các page con */
  pages: PageConfig[];
}

// ============================================================================
// Route Configuration
// ============================================================================

/**
 * Cấu hình routes cho tất cả các roles
 * Mỗi role có base path, layout, và danh sách pages con
 */
const roleRoutes: Record<string, RoleRouteConfig> = {
  USER: {
    basePath: "/user",
    allowedRoles: ["USER"],
    Layout: NormalUserLayout as ComponentType<LayoutProps>,
    defaultPage: "dashboard",
    pages: [
      { path: "dashboard", component: Dashboard },
      { path: "test-results", component: TestResults },
      { path: "chat", component: ChatPage },
      { path: "chat/:roomId", component: ChatRoomPage },
      { path: "profile", component: Profile, componentProps: { currentUser: null } },
    ],
  },
  ADMIN: {
    basePath: "/admin",
    allowedRoles: ["ADMIN"],
    Layout: AdminLayout as ComponentType<LayoutProps>,
    defaultPage: "dashboard",
    pages: [
      { path: "dashboard", component: AdminDashboardPage },
      { path: "user-management", component: ManagerUserManagementPage },
      { path: "patient-management", component: AdminPatientManagementPage },
      {
        path: "test-orders",
        component: TestOrdersPage,
      },
      { path: "audit-reports", component: AdminAuditReportsPage },
      { path: "profile", component: AdminProfilePage },
    ],
  },
  MANAGER: {
    basePath: "/manager",
    allowedRoles: ["MANAGER"],
    Layout: ManagerLayout as ComponentType<LayoutProps>,
    defaultPage: "user-management",
    pages: [
      { path: "user-management", component: ManagerUserManagementPage },
      { path: "instruments", component: ServiceInstrumentPage },
      { path: "profile", component: Profile, componentProps: { currentUser: null } },
    ],
  },
  LAB_USER: {
    basePath: "/labuser",
    allowedRoles: ["LAB_USER"],
    Layout: LabUserLayout as ComponentType<LayoutProps>,
    defaultPage: "dashboard",
    pages: [
      { path: "dashboard", component: LabUserDashboard },
      { path: "patients", component: AdminPatientManagementPage },
      { path: "test-orders", component: TestOrdersPage },
      { path: "test-results", component: TestResultsPage },
      { path: "instruments", component: ServiceInstrumentPage },
      { path: "reagents", component: ReagentManagementPage },
      { path: "chat", component: LabUserChatPage },
  // removed: medical record access logs feature
      {
        path: "reports",
        component: () => (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Báo cáo</h2>
            <p className="text-gray-500 mt-2">Trang báo cáo đang được phát triển</p>
          </div>
        ),
      },
      { path: "profile", component: Profile, componentProps: { currentUser: null } },
    ],
  },
  SERVICE: {
    basePath: "/service",
    allowedRoles: ["SERVICE"],
    Layout: ServiceLayout as ComponentType<LayoutProps>,
    defaultPage: "dashboard",
    pages: [
      { path: "dashboard", component: ServiceDashboardPage },
      { path: "event-logs", component: AdminAuditReportsPage },
      { path: "reagents", component: ReagentManagementPage },
      { path: "instruments", component: ServiceInstrumentPage },
      {
        path: "test-orders",
        component: TestOrdersPage,
      },
      { path: "profile", component: Profile, componentProps: { currentUser: null } },
    ],
  },
};

// ============================================================================
// Helper Functions for Route Generation
// ============================================================================

/**
 * Render page component với wrapper nếu có
 */
function renderPage(
  pageConfig: PageConfig,
  user: User
): ReactNode {
  const { component: Component, wrapper: Wrapper, componentProps = {} } = pageConfig;
  
  // Nếu có componentProps với currentUser, inject user vào
  const props = { ...componentProps };
  if (props.currentUser === null) {
    props.currentUser = user;
  }

  const pageElement = <Component {...props} />;

  if (Wrapper) {
    return <Wrapper>{pageElement}</Wrapper>;
  }

  return pageElement;
}

/**
 * Tạo routes cho một role config
 * Trả về mảng các Route elements để flatten vào Routes
 */
function createRoleRoutes(
  config: RoleRouteConfig,
  user: User,
  onLogout: () => void,
  currentPage: string,
  setCurrentPage: (page: string) => void,
  navigate: ReturnType<typeof useNavigate>
): ReactElement[] {
  const { basePath, allowedRoles, Layout, defaultPage, pages } = config;

  // Handler để navigate và update state
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    navigate(`${basePath}/${page}`);
  };

  // Base layout props
  const baseLayoutProps = {
    currentUser: user,
    onLogout,
    currentPage,
    onNavigate: handleNavigate,
  };

  const routes: ReactElement[] = [];

  // Base route - redirect đến default page
  const defaultPageConfig = pages.find((p) => p.path === defaultPage) || pages[0];
  routes.push(
    <Route
      key={basePath}
      path={basePath}
      element={
        <ProtectedRoute allowedRoles={allowedRoles}>
          <Layout
            {...baseLayoutProps}
          >
            {renderPage(defaultPageConfig, user)}
          </Layout>
        </ProtectedRoute>
      }
    />
  );

  // Các routes con cho từng page
  pages.forEach((pageConfig) => {
    const fullPath = `${basePath}/${pageConfig.path}`;
    routes.push(
      <Route
        key={fullPath}
        path={fullPath}
        element={
          <ProtectedRoute allowedRoles={allowedRoles}>
            <Layout
              {...baseLayoutProps}
              currentPage={pageConfig.path}
            >
              {renderPage(pageConfig, user)}
            </Layout>
          </ProtectedRoute>
        }
      />
    );
  });

  return routes;
}

// ============================================================================
// Main AppRoutes Component
// ============================================================================

/**
 * Component chính quản lý tất cả routes của ứng dụng
 * - Tự động sinh routes từ cấu hình roleRoutes
 * - Xử lý redirect cho base paths
 * - Quản lý state cho currentPage của mỗi role
 */
export function AppRoutes() {
  const { user, onLogout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  // State để track currentPage cho mỗi role
  const [pageStates, setPageStates] = useState<Record<string, string>>({
    USER: "dashboard",
    ADMIN: "dashboard",
    MANAGER: "user-management",
    LAB_USER: "dashboard",
    SERVICE: "dashboard",
  });

  // Helper để get page từ pathname
  const getPageFromPath = (pathname: string, basePath: string): string => {
    const remaining = pathname.replace(basePath, "").replace(/^\//, "");
    return remaining || "dashboard";
  };

  // Sync state với URL khi location thay đổi
  useEffect(() => {
    Object.values(roleRoutes).forEach((config) => {
      const { basePath } = config;
      if (location.pathname.startsWith(basePath)) {
        // Bỏ qua các routes đặc biệt của labuser
        if (
          basePath === "/labuser" &&
          (location.pathname.includes("/create-test-order") ||
            location.pathname.includes("/select-instruments") ||
            location.pathname.includes("/select-reagents") ||
            location.pathname.includes("/patient-medical-records") ||
            location.pathname.includes("/patients/"))
        ) {
          return;
        }

        // Bỏ qua các routes đặc biệt của service
        if (
          basePath === "/service" &&
          (location.pathname.includes("/create-test-order") ||
            location.pathname.includes("/select-instruments") ||
            location.pathname.includes("/select-reagents"))
        ) {
          return;
        }

        // Bỏ qua các routes đặc biệt của admin
        if (
          basePath === "/admin" &&
          (location.pathname.includes("/create-test-order") ||
            location.pathname.includes("/select-instruments") ||
            location.pathname.includes("/select-reagents") ||
            location.pathname.includes("/patient-management") ||
            location.pathname.includes("/audit-reports"))
        ) {
          return;
        }

        const page = getPageFromPath(location.pathname, basePath);
        const roleKey = Object.keys(roleRoutes).find(
          (key) => roleRoutes[key].basePath === basePath
        );

        if (roleKey && pageStates[roleKey] !== page && page !== "") {
          setPageStates((prev) => ({ ...prev, [roleKey]: page }));
        }
      }
    });
  }, [location.pathname, pageStates]);

  // Auto-redirect base paths đến default pages
  useEffect(() => {
    Object.values(roleRoutes).forEach((config) => {
      if (location.pathname === config.basePath) {
        navigate(`${config.basePath}/${config.defaultPage}`, { replace: true });
      }
    });
  }, [location.pathname, navigate]);

  // Helper để set currentPage cho một role
  const setCurrentPage = (role: string, page: string) => {
    setPageStates((prev) => ({ ...prev, [role]: page }));
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <HomeLayout
            onShowLogin={() => navigate("/login")}
            onShowRegister={() => navigate("/register")}
          />
        }
      />
      <Route path="/login" element={<LoginLayout />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/forgot-password/success" element={<ForgotPasswordSuccessPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

      {/* Dynamic Role Routes - Tự động sinh từ cấu hình */}
      {Object.entries(roleRoutes).flatMap(([role, config]) =>
        createRoleRoutes(
          config,
          user!,
          onLogout,
          pageStates[role],
          (page) => setCurrentPage(role, page),
          navigate
        )
      )}

      <Route
        path="/admin/create-test-order"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout
              currentUser={user!}
              onLogout={onLogout}
              currentPage="test-orders"
              onNavigate={(page) => {
                setCurrentPage("ADMIN", page);
                navigate(`/admin`);
              }}
            >
              <CreateTestOrderPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/select-instruments"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout
              currentUser={user!}
              onLogout={onLogout}
              currentPage="test-orders"
              onNavigate={(page) => {
                setCurrentPage("ADMIN", page);
                navigate(`/admin`);
              }}
            >
              <SelectInstrumentsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/select-reagents"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout
              currentUser={user!}
              onLogout={onLogout}
              currentPage="test-orders"
              onNavigate={(page) => {
                setCurrentPage("ADMIN", page);
                navigate(`/admin`);
              }}
            >
              <SelectReagentsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/labuser/create-test-order"
        element={
          <ProtectedRoute allowedRoles={["LAB_USER"]}>
            <LabUserLayout
              currentUser={user!}
              onLogout={onLogout}
              currentPage="test-orders"
              onNavigate={(page) => {
                setCurrentPage("LAB_USER", page);
                navigate(`/labuser`);
              }}
            >
              <CreateTestOrderPage />
            </LabUserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/labuser/select-instruments"
        element={
          <ProtectedRoute allowedRoles={["LAB_USER"]}>
            <LabUserLayout
              currentUser={user!}
              onLogout={onLogout}
              currentPage="test-orders"
              onNavigate={(page) => {
                setCurrentPage("LAB_USER", page);
                navigate(`/labuser`);
              }}
            >
              <SelectInstrumentsPage />
            </LabUserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/labuser/select-reagents"
        element={
          <ProtectedRoute allowedRoles={["LAB_USER"]}>
            <LabUserLayout
              currentUser={user!}
              onLogout={onLogout}
              currentPage="test-orders"
              onNavigate={(page) => {
                setCurrentPage("LAB_USER", page);
                navigate(`/labuser`);
              }}
            >
              <SelectReagentsPage />
            </LabUserLayout>
          </ProtectedRoute>
        }
      />
   
      <Route
        path="/service/create-test-order"
        element={
          <ProtectedRoute allowedRoles={["SERVICE"]}>
            <ServiceLayout
              currentUser={user!}
              onLogout={onLogout}
              currentPage="test-orders"
              onNavigate={(page) => {
                setCurrentPage("SERVICE", page);
                navigate(`/service`);
              }}
            >
              <CreateTestOrderPage />
            </ServiceLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/service/select-instruments"
        element={
          <ProtectedRoute allowedRoles={["SERVICE"]}>
            <ServiceLayout
              currentUser={user!}
              onLogout={onLogout}
              currentPage="test-orders"
              onNavigate={(page) => {
                setCurrentPage("SERVICE", page);
                navigate(`/service`);
              }}
            >
              <SelectInstrumentsPage />
            </ServiceLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/service/select-reagents"
        element={
          <ProtectedRoute allowedRoles={["SERVICE"]}>
            <ServiceLayout
              currentUser={user!}
              onLogout={onLogout}
              currentPage="test-orders"
              onNavigate={(page) => {
                setCurrentPage("SERVICE", page);
                navigate(`/service`);
              }}
            >
              <SelectReagentsPage />
            </ServiceLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/labuser/patients/:id"
        element={
          <ProtectedRoute allowedRoles={["LAB_USER"]}>
            <LabUserLayout
              currentUser={user!}
              onLogout={onLogout}
              currentPage="patients"
              onNavigate={(page) => {
                setCurrentPage("LAB_USER", page);
                navigate(`/labuser`);
              }}
            >
              <PatientDetailPage />
            </LabUserLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/patient-management/:id"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout
              currentUser={user!}
              onLogout={onLogout}
              currentPage="patient-management"
              onNavigate={(page) => {
                setCurrentPage("ADMIN", page);
                navigate(`/admin`);
              }}
            >
              {<PatientDetailPage />}
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/audit-reports/:id"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout
              currentUser={user!}
              onLogout={onLogout}
              currentPage="audit-reports"
              onNavigate={(page) => {
                setCurrentPage("ADMIN", page);
                navigate(`/admin`);
              }}
            >
              {<EventLogDetailPage />}
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
