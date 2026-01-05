import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type Props = {
    title: string;
};

function AppHeader({ title }: Props) {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const handleLogout = () => {
        setUser(null);
        navigate("/signin", { replace: true });
    };

    return (
        <header className="w-full flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
            <div className="text-slate-100 text-lg font-semibold">{title}</div>

            <div className="flex items-center gap-4">
                <div className="text-slate-200 text-sm">
                    {user ? `${user.firstName} ${user.lastName} (${user.role})` : ""}
                </div>

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}

export default AppHeader;
