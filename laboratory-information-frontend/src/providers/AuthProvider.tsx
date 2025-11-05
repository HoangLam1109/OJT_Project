// AuthProvider.tsx
import { useState, useEffect } from "react";
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

  useEffect(() => {
    // 1. BỎ QUA TRANG LOGIN
    if (location.pathname === '/login') {
      setLoading(false);
      return;
    }

    const initializeAuth = async () => {
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
  }, [location, user]); // DÙNG location + user → ESLint OK

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