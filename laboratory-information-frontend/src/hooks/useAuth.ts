import { useAuthContext } from "../context/types/useAuthContext";

export function useAuth() {
  return useAuthContext();
}
