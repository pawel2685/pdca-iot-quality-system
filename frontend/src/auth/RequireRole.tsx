import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { UserRole } from "./AuthContext";

export function RequireRole({ allowedRoles }: { allowedRoles?: UserRole[] }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/sign-in" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/employee" replace />;
    }

    return <Outlet />;
}
