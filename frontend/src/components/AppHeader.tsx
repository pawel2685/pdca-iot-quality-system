import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { Alert } from "../types/Alert";

type Props = {
    title: string;
    alert?: Alert | null;
};

function AppHeader({ title, alert }: Props) {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const handleLogout = () => {
        setUser(null);
        navigate("/signin", { replace: true });
    };

    return (
        <header className="w-full bg-slate-900 border-b border-slate-800">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-6">
                    <div className="text-slate-100 text-lg font-semibold">{title}</div>

                    {alert && (
                        <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
                            <span className={`inline-block px-3 py-1 text-sm font-bold rounded ${alert.status === "ALERT" ? "bg-red-600/30 border border-red-500 text-red-100" : "bg-amber-600/30 border border-amber-500 text-amber-100"}`}>
                                {alert.status === "ALERT" ? "🔴 ALERT" : "⚠️ WARNING"}
                            </span>
                            <div className="text-sm flex gap-4">
                                <div>
                                    <span className="text-slate-400">Machine:</span>
                                    <span className="text-slate-100 ml-2 font-semibold">{alert.machine}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Parameter:</span>
                                    <span className="text-slate-100 ml-2 font-semibold">{alert.parameter}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Value:</span>
                                    <span className={`ml-2 font-semibold ${alert.status === "ALERT" ? "text-red-400" : "text-amber-400"}`}>{alert.value}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Threshold:</span>
                                    <span className="text-slate-100 ml-2 font-semibold">{alert.threshold}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

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
            </div>
        </header>
    );
}

export default AppHeader;
