import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthUser } from "./AuthContext";

const STORAGE_KEY = "PDCA_AUTH_USER";

function readStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

    useEffect(() => {
        if (!user) {
            localStorage.removeItem(STORAGE_KEY);
            return;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }, [user]);

    const value = useMemo(() => ({ user, setUser }), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
