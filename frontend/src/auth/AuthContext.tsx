import { createContext, useContext } from "react";

export type UserRole = "MANAGER" | "SUPERVISOR" | "ADMIN" | "LEADER" | "WORKER";

export interface AuthUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}

export interface AuthContextValue {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("AuthProvider is missing");
    }
    return ctx;
}
