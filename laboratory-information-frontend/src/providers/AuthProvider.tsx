import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";
import type { AuthContextType } from "../types/AuthContextType"; 
import type { User } from "../types/User";
import type { SafeUser } from "../types/User";
import { handleGoogleCallback, isGoogleCallback, cleanGoogleCallbackUrl } from "../service/authService/googleOAuthApi";
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Kiểm tra Google OAuth callback
      if (isGoogleCallback()) {
        try {
          const googleUser = await handleGoogleCallback();
          if (googleUser) {
            onLogin(googleUser);
            cleanGoogleCallbackUrl();
            return;
          }
        } catch (error) {
          console.error('Google OAuth callback error:', error);
        }
      }

      // Kiểm tra user đã lưu trong localStorage
      const savedUser = localStorage.getItem("limsUser");
      if (savedUser) setUser(JSON.parse(savedUser));
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const onLogin = (user: User) => {
  setUser(user);
  
  const safeUser: SafeUser = {
    id: user.id,
    name: user.name,
    role: Array.isArray(user.role) ? user.role.flat() : [user.role],
    active: user.active,
    permissions: user.permissions,
  };
  
  localStorage.setItem("limsUser", JSON.stringify(safeUser));
};

  const onLogout = () => {
    // Clear state immediately
    setUser(null);
    // Clear all auth-related localStorage
    localStorage.removeItem("limsUser");
    localStorage.removeItem("authToken");
    // Force clear any stale data
    setLoading(false);
  };

  const value: AuthContextType = { user, onLogin, onLogout, loading };

  return <AuthContext.Provider 
             value={value}>{children}
         </AuthContext.Provider>;
}
