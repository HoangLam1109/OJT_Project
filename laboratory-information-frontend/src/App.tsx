import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { LoginForm } from './components/auth/LoginForm';

import { AdminLayout } from './layouts/AdminLayout';
import { LabManagerLayout } from './layouts/LabManagerLayout';
import { ServiceLayout } from './layouts/ServiceLayout';
import { LabUserLayout } from './layouts/LabUserLayout';
import { TechnicianLayout } from './layouts/TechnicianLayout';
import { NormalUserLayout } from './layouts/NormalUserLayout';
import { DashboardPage } from './pages/DashboardPage';
import { UserManagementPage } from './pages/UserManagementPage';
import PatientManagementPage from './pages/PatientManagementPage';
import { TestOrderManagementPage } from './pages/TestOrderManagementPage';
import { AuditReportsPage } from './pages/AuditReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AddUserPage } from './pages/AddUserPage';
import { LabManagerDashboard } from './pages/LabManagerDashboard';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'laboratory_manager' | 'service' | 'lab_user' | 'normal_user' | 'technician';
  active: boolean;
  lastLogin?: string;
  permissions: string[];
  phone_number?: string;
  identify_number?: string;
  gender?: string;
  age?: number;
  address?: string;
  date_of_birth?: string;
  schedule?: {
    startTime: string;
    endTime: string;
    workDays: string[];
  };
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  testHistory: Test[];
}

export interface Test {
  id: string;
  patientId: string;
  testType: string;
  orderDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'validated' | 'ai_reviewed';
  sampleId?: string;
  results?: string;
  fee: number;
  technician?: string;
  completionDate?: string;
  aiReviewData?: {
    reviewedAt: string;
    reviewScore: number;
    confidence: number;
    flags: string[];
    recommendations: string[];
    anomalies: Array<{
      parameter: string;
      value: number;
      expected: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>;
  };
}

export interface Chemical {
  id: string;
  name: string;
  batchCode: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  minStockLevel: number;
  costPerUnit: number;
  supplier: string;
  testTypes: string[];
  quantityPerTest: number;
}

export interface Bill {
  id: string;
  patientId: string;
  tests: string[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'overdue';
  paymentMethod?: string;
  paymentDate?: string;
  dueDate: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'forgot-password'>('login');
  const [adminCurrentPage, setAdminCurrentPage] = useState<string>('dashboard');

  // Mock authentication check
  useEffect(() => {
    const savedUser = localStorage.getItem('limsUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('limsUser', JSON.stringify(user));
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('limsUser');
    setCurrentPage('login');
  };

  const handleShowHome = () => {
    setCurrentPage('home');
  };

  const handleShowForgotPassword = () => {
    setCurrentPage('forgot-password');
  };

  // Render appropriate dashboard based on role
  const renderRoleDashboard = () => {
    if (!currentUser) return <DashboardPage />;
    
    switch (currentUser.role) {
      case 'laboratory_manager':
        return <LabManagerDashboard />;
      case 'service':
      case 'lab_user':
      case 'technician':
      case 'normal_user':
        return <DashboardPage />;
      default:
        return <DashboardPage />;
    }
  };

  const renderCurrentPage = () => {
    if (!currentUser) return <DashboardPage />;
    
    // For non-admin roles, only show dashboard for now
    if (currentUser.role !== 'admin') {
      return renderRoleDashboard();
    }

    // Admin-specific pages
    switch (adminCurrentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'add-user':
        return <AddUserPage 
          onBack={() => setAdminCurrentPage('user-management')}
          onSave={(newUser) => {
            // Add user logic here
            console.log('New user:', newUser);
            setAdminCurrentPage('user-management');
          }}
        />;
      case 'user-management':
        return <UserManagementPage 
          currentUser={currentUser} 
          onNavigateToAddUser={() => setAdminCurrentPage('add-user')}
        />;
      case 'patient-management':
        return <PatientManagementPage />;
      case 'test-management':
        return <TestOrderManagementPage currentUser={currentUser} />;
      case 'audit-reports':
        return <AuditReportsPage currentUser={currentUser} />;
      case 'settings':
        return <SettingsPage currentUser={currentUser} />;
      // Legacy routes for backward compatibility
      case 'users':
      case 'roles':
      case 'sessions':
      case 'user-audit':
        return <UserManagementPage 
          currentUser={currentUser} 
          onNavigateToAddUser={() => setAdminCurrentPage('add-user')}
        />;
      case 'patients':
      case 'patient-audit':
        return <PatientManagementPage />;
      case 'orders':
      case 'results':
      case 'comments':
      case 'flagging':
      case 'sync-health':
      case 'test-audit':
        return <TestOrderManagementPage currentUser={currentUser} />;
      default:
        return <DashboardPage />;
    }
  };

  // Render appropriate layout based on role
  const renderLayout = () => {
    if (!currentUser) return null;
    
    const commonProps = {
      currentUser,
      onLogout: handleLogout,
      currentPage: adminCurrentPage,
      onNavigate: setAdminCurrentPage,
      children: renderCurrentPage()
    };

    switch (currentUser.role) {
      case 'admin':
        return <AdminLayout {...commonProps} />;
      case 'laboratory_manager':
        return <LabManagerLayout {...commonProps} />;
      case 'service':
        return <ServiceLayout {...commonProps} />;
      case 'lab_user':
        return <LabUserLayout {...commonProps} />;
      case 'technician':
        return <TechnicianLayout {...commonProps} />;
      case 'normal_user':
        return <NormalUserLayout {...commonProps} />;
      default:
        return <AdminLayout {...commonProps} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        {currentPage === 'login' && (
          <LoginForm 
            onLogin={handleLogin}
            onShowForgotPassword={handleShowForgotPassword}
            onBackToHome={handleShowHome}
          />
        )}
        {currentPage === 'forgot-password' && (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Forgot Password</h2>
              <p className="text-muted-foreground mb-4">This feature is coming soon.</p>
              <button 
                onClick={() => setCurrentPage('login')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
        <Toaster />
      </>
    );
  }

  return (
    <>
      {renderLayout()}
      <Toaster />
    </>
  );
}

export default App;