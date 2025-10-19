import { createContext } from "react";
import type { AuthContextType } from "../pages/login/types/AuthContextType";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
