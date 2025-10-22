import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";
import type { AuthContextType } from "../types/AuthContextType"; 
import type { User } from "../types/User";
import type { SafeUser } from "../types/User";
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("limsUser");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const onLogin = (user: User) => {
  setUser(user);
  
  const safeUser: SafeUser = {
    id: user.id,
    name: user.name,
    role: user.role,
    active: user.active,
    permissions: user.permissions,
  };

  localStorage.setItem("limsUser", JSON.stringify(safeUser));
};

  const onLogout = () => {
    setUser(null);
    localStorage.removeItem("limsUser");
  };

  const value: AuthContextType = { user, onLogin, onLogout, loading };

  return <AuthContext.Provider 
             value={value}>{children}
         </AuthContext.Provider>;
}
