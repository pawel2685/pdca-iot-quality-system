import { useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthUser } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const value = useMemo(() => ({ user, setUser }), [user]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
