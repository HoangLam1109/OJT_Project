// AuthProvider.tsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // THÊM DÒNG NÀY
import { AuthContext } from "../context/AuthContext";
import type { AuthContextType } from "../types/AuthContextType";
import type { User, SafeUser } from "../types/User";
import { apiClient } from "../service/apiClient";
import { handleGoogleCallback, isGoogleCallback, cleanGoogleCallbackUrl } from "../service/authService/googleOAuthApi";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation(); // THÊM DÒNG NÀY
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (location.pathname === '/login') {
      setLoading(false);
      hasInitialized.current = false; // Reset khi vào trang login
      return;
    }

    // 2. NẾU ĐÃ CÓ USER HOẶC ĐÃ INITIALIZE, KHÔNG CẦN GỌI API LẠI
    if (user || hasInitialized.current) {
      setLoading(false);
      return;
    }

    const initializeAuth = async () => {
      hasInitialized.current = true; // Đánh dấu đã bắt đầu initialize

      // Google OAuth
      if (isGoogleCallback()) {
        try {
          const googleUser = await handleGoogleCallback();
          if (googleUser) {
            onLogin(googleUser);
            cleanGoogleCallbackUrl();
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Google OAuth error:', error);
        }
      }

      // KIỂM TRA TOKEN
      try {
        const res = await apiClient.get('/user/me/roles');
        const data = res.data;
        const authenticatedUser: User = {
          id: data.userId,
          name: data.fullName,
          email: data.email,
          role: data.roles.map((r: { roleCode: string }) => r.roleCode),
          active: true,
          permissions: data.aggregatedPrivileges || [],
        };

        onLogin(authenticatedUser);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status !== 401) {
            console.error('Auth check failed:', error);
          }
        } else {
          console.error('Unknown error:', error);
        }
      } finally {
        setLoading(false);
      }

    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // CHỈ THEO DÕI location.pathname, KHÔNG BAO GỒM user

  const onLogin = (userData: User) => {
    setUser(userData);
    const safeUser: SafeUser = {
      id: userData.id,
      name: userData.name,
      role: Array.isArray(userData.role) ? userData.role : [userData.role],
      active: userData.active ?? true,
      permissions: userData.permissions || [],
    };
    localStorage.setItem("limsUser", JSON.stringify(safeUser));
  };

  const onLogout = async () => {
    if (location.pathname === '/login') {
      setUser(null);
      localStorage.removeItem("limsUser");
      hasInitialized.current = false; // Reset flag
      setLoading(false);
      return;
    }

    try {
      await apiClient.post('/logout').catch(() => { });
    } catch (error) {
      console.error('Logout error:', error);
    }

    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    localStorage.removeItem("limsUser");
    setUser(null);
    hasInitialized.current = false; // Reset flag để có thể initialize lại khi login
    window.location.href = '/login';
  };

  const value: AuthContextType = { user, onLogin, onLogout, loading };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center h-screen text-xl">
          Đang tải...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
