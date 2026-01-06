import { useEffect, useState } from "react";
import type { Alert } from "../types/Alert";
import { getUnassignedAlerts } from "../api/UnassignedAlerts";
import AppHeader from "../components/AppHeader";
import { useAuth } from "../auth/AuthContext";
import { createPdcaCaseFromAlert } from "../api/PdcaCases";

function ManagerDashboardPage() {
    const { user } = useAuth();
    const [unassignedAlerts, setUnassignedAlerts] = useState<Alert[]>([]);
    const [assignedAlerts, setAssignedAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [assignError, setAssignError] = useState<string | null>(null);
    const [assigningId, setAssigningId] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadAlerts() {
            try {
                setLoading(true);
                setError(null);
                const data = await getUnassignedAlerts(7);
                if (isMounted) {
                    setUnassignedAlerts(data);
                    setAssignedAlerts([]);
                }
            } catch {
                if (isMounted) {
                    setError("Failed to load alerts");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadAlerts();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleAssignToMe = async (alert: Alert) => {
        if (!user) {
            setAssignError("User not authenticated");
            return;
        }

        setAssignError(null);
        setAssigningId(alert.id);

        try {
            await createPdcaCaseFromAlert(alert.id, user.id);

            setUnassignedAlerts((prev) => prev.filter((a) => a.id !== alert.id));
            setAssignedAlerts((prev) => [
                ...prev,
                { ...alert, state: "ASSIGNED" },
            ]);
        } catch (error) {
            setAssignError(error instanceof Error ? error.message : "Failed to assign alert");
        } finally {
            setAssigningId(null);
        }
    };

    const renderStatusBadge = (status: Alert["status"]) => {
        return (
            <span
                className={
                    "text-xs px-2 py-0.5 rounded-full border " +
                    (status === "ALERT"
                        ? "bg-red-500/20 border-red-500 text-red-100"
                        : "bg-amber-400/20 border-amber-400 text-amber-100")
                }
            >
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
            <AppHeader title="Manager Dashboard" />

            <main className="flex-1 flex">
                <section className="w-1/4 border-r border-slate-800 p-4 flex flex-col">
                    <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide text-slate-300">
                        Unassigned alerts
                    </h2>

                    {assignError && (
                        <div className="mb-3 p-2 text-xs bg-red-900/40 border border-red-500 text-red-100 rounded">
                            {assignError}
                        </div>
                    )}

                    <div className="flex-1 rounded-lg bg-slate-900/40 overflow-y-auto space-y-2">
                        {loading && (
                            <div className="h-full flex items-center justify-center text-sm text-slate-400">
                                Loading alerts...
                            </div>
                        )}

                        {error && !loading && (
                            <div className="h-full flex items-center justify-center text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        {!loading && !error && unassignedAlerts.length === 0 && (
                            <div className="h-full flex items-center justify-center text-sm text-slate-500">
                                No unassigned alerts
                            </div>
                        )}

                        {!loading && !error && unassignedAlerts.length > 0 && (
                            <ul className="space-y-2">
                                {unassignedAlerts.map((alert) => (
                                    <li
                                        key={alert.id}
                                        className={
                                            "px-3 py-2 text-sm rounded-md border flex flex-col gap-1 " +
                                            (alert.status === "ALERT"
                                                ? "bg-red-900/40 border-red-500 hover:bg-red-900/70"
                                                : "bg-amber-900/40 border-amber-400 hover:bg-amber-900/70")
                                        }
                                    >
                                        <div className="flex justify-between items-center gap-2">
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {alert.machine}
                                                </span>
                                                <span className="text-[11px] text-slate-200">
                                                    {alert.parameter}: {alert.value} (thr{" "}
                                                    {alert.threshold})
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {renderStatusBadge(alert.status)}

                                                <button
                                                    type="button"
                                                    className="text-[11px] px-2 py-1 rounded border border-sky-500 text-sky-100 hover:bg-sky-500/10 disabled:opacity-50"
                                                    onClick={() => handleAssignToMe(alert)}
                                                    disabled={assigningId === alert.id}
                                                >
                                                    {assigningId === alert.id ? "Assigning..." : "Assign to me"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-[10px] text-slate-200">
                                            {alert.timestamp} • {alert.state}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>

                <section className="flex-1 p-4 flex flex-col">
                    <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide text-slate-300">
                        My PDCA alerts (PLAN)
                    </h2>

                    <div className="flex-1 rounded-lg bg-slate-900/40 border border-slate-800 p-4 overflow-y-auto">
                        {assignedAlerts.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-sm text-slate-500">
                                No alerts assigned to you yet.
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {assignedAlerts.map((alert) => {
                                    const pdcaPhase = "PLAN";
                                    const getPhaseColors = (phase: string) => {
                                        switch (phase) {
                                            case "PLAN":
                                                return {
                                                    bg: "bg-blue-600/20",
                                                    border: "border-blue-500",
                                                    text: "text-blue-100",
                                                    cardBg: "#1e3a8a"
                                                };
                                            case "DO":
                                                return {
                                                    bg: "bg-green-600/20",
                                                    border: "border-green-500",
                                                    text: "text-green-100",
                                                    cardBg: "#166534"
                                                };
                                            case "CHECK":
                                                return {
                                                    bg: "bg-amber-600/20",
                                                    border: "border-amber-500",
                                                    text: "text-amber-100",
                                                    cardBg: "#92400e"
                                                };
                                            case "ACT":
                                                return {
                                                    bg: "bg-purple-600/20",
                                                    border: "border-purple-500",
                                                    text: "text-purple-100",
                                                    cardBg: "#7c2d12"
                                                };
                                            default:
                                                return {
                                                    bg: "bg-blue-600/20",
                                                    border: "border-blue-500",
                                                    text: "text-blue-100",
                                                    cardBg: "#1e3a8a"
                                                };
                                        }
                                    };
                                    const colors = getPhaseColors(pdcaPhase);

                                    return (
                                        <li
                                            key={alert.id}
                                            className="flex items-center gap-6 rounded-lg px-4 py-4 border border-slate-700"
                                            style={{ backgroundColor: colors.cardBg }}
                                        >
                                            <div className="flex items-center gap-1">
                                                <span className={`text-lg px-3 py-1 rounded-full ${colors.bg} border ${colors.border} ${colors.text} font-bold`}>
                                                    {pdcaPhase}
                                                </span>
                                            </div>
                                            <div className="h-8 w-px bg-slate-400/30"></div>
                                            <div className="font-bold text-lg min-w-[120px]">{alert.status}</div>
                                            <div className="h-8 w-px bg-slate-400/30"></div>
                                            <div className="font-semibold text-lg min-w-[140px]">{alert.machine}</div>
                                            <div className="h-8 w-px bg-slate-400/30"></div>
                                            <div className="flex items-center gap-8 flex-1 text-sm">
                                                <div className="font-medium">{alert.parameter}</div>
                                                <div>value: <span className="font-semibold">{alert.value}</span></div>
                                                <div>threshold: <span className="font-semibold">{alert.threshold}</span></div>
                                            </div>
                                            <div className="text-sm text-slate-200 font-semibold">{alert.state}</div>
                                            <button
                                                type="button"
                                                className="text-xs px-3 py-1 rounded border border-sky-500 text-sky-100 hover:bg-sky-500/10 ml-2"
                                                onClick={() => {
                                                    console.log("Details for alert", alert.id);
                                                }}
                                            >
                                                Details
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ManagerDashboardPage;
