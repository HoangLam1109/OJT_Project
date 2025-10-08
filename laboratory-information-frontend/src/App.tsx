import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { LoginForm } from './layouts/AuthLayout';

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
  const handleShowHome = () => {
    setCurrentPage('home');
  };

  const handleShowForgotPassword = () => {
    setCurrentPage('forgot-password');
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
        {/* {currentPage === 'home' && <HomePage onShowLogin={handleShowLogin} />} */}
        {currentPage === 'login' && (
          <LoginForm 
            onLogin={handleLogin}
            onShowForgotPassword={handleShowForgotPassword}
            onBackToHome={handleShowHome}
            embedded={false}
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
      <Toaster />
    </>
  );
}

export default App;