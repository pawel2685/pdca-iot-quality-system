import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Alert } from "../types/Alert";
import { getUnassignedAlerts } from "../api/UnassignedAlerts";
import AppHeader from "../components/AppHeader";
import { useAuth } from "../auth/AuthContext";
import { createPdcaCaseFromAlert, createPdcaCaseFromTask, getPdcaCasesList, type PdcaCaseListItem } from "../api/PdcaCases";
import { API_BASE_URL } from "../config/ApiConfig";

function ManagerDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [unassignedAlerts, setUnassignedAlerts] = useState<Alert[]>([]);
    const [assignedCases, setAssignedCases] = useState<PdcaCaseListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [assignError, setAssignError] = useState<string | null>(null);
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [taskTitle, setTaskTitle] = useState("");
    const [creatingTask, setCreatingTask] = useState(false);
    const [taskError, setTaskError] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<number | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            if (!user) return;

            try {
                setLoading(true);
                setError(null);
                const [alerts, cases] = await Promise.all([
                    getUnassignedAlerts(7),
                    getPdcaCasesList(user.id, "PLAN"),
                ]);
                if (isMounted) {
                    setUnassignedAlerts(alerts);
                    setAssignedCases(cases);
                }
            } catch {
                if (isMounted) {
                    setError("Failed to load data");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, [user]);

    const handleAssignToMe = async (alert: Alert) => {
        if (!user) {
            setAssignError("User not authenticated");
            return;
        }

        setAssignError(null);
        setAssigningId(alert.id);

        try {
            const alertData = {
                status: alert.status,
                parameter: alert.parameter,
                value: alert.value,
                threshold: alert.threshold,
                machine: alert.machine,
            };

            const pdcaCase = await createPdcaCaseFromAlert(alert.id, user.id, alertData);

            setUnassignedAlerts((prev) => prev.filter((a) => a.id !== alert.id));

            const newCase: PdcaCaseListItem = {
                id: pdcaCase.id,
                caseType: "ALERT",
                alertId: alert.id,
                title: pdcaCase.title,
                description: null,
                ownerUserId: pdcaCase.ownerUserId,
                phase: "PLAN",
                status: "ACTIVE",
                createDate: pdcaCase.createDate,
                updateDate: pdcaCase.updateDate,
                alert: alert,
            };

            setAssignedCases((prev) => [newCase, ...prev]);
        } catch (error) {
            setAssignError(error instanceof Error ? error.message : "Failed to assign alert");
        } finally {
            setAssigningId(null);
        }
    };

    const handleCreateTask = async () => {
        if (!user || !taskTitle.trim()) {
            return;
        }

        setTaskError(null);
        setCreatingTask(true);

        try {
            const newCase = await createPdcaCaseFromTask(taskTitle, user.id);

            setAssignedCases((prev) => [
                {
                    id: newCase.id,
                    caseType: "TASK",
                    alertId: null,
                    title: newCase.title,
                    description: newCase.description,
                    ownerUserId: newCase.ownerUserId,
                    phase: newCase.phase,
                    status: newCase.status,
                    createDate: newCase.createDate,
                    updateDate: newCase.updateDate,
                    alert: null,
                },
                ...prev,
            ]);

            setTaskTitle("");
        } catch (error) {
            setTaskError(error instanceof Error ? error.message : "Failed to create task");
        } finally {
            setCreatingTask(false);
        }
    };

    const handleRemoveCase = async (caseId: number) => {
        if (!user) return;

        setRemovingId(caseId);

        try {
            const response = await fetch(`${API_BASE_URL}/pdca/cases/${caseId}?userId=${user.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            setAssignedCases((prev) => prev.filter((c) => c.id !== caseId));
        } catch (error) {
            setAssignError(error instanceof Error ? error.message : "Failed to remove case");
        } finally {
            setRemovingId(null);
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

                    {(user?.role === "MANAGER" || user?.role === "SUPERVISOR") && (
                        <div className="mb-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700 flex gap-2">
                            <input
                                type="text"
                                placeholder="Task title..."
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !creatingTask && taskTitle.trim() && handleCreateTask()}
                                className="flex-1 px-3 py-2 text-sm rounded bg-slate-900 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                disabled={creatingTask}
                            />
                            <button
                                type="button"
                                onClick={handleCreateTask}
                                disabled={!taskTitle.trim() || creatingTask}
                                className="px-3 py-2 text-sm rounded bg-green-600 hover:bg-green-700 text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {creatingTask ? "Creating..." : "Create Task"}
                            </button>
                        </div>
                    )}

                    {taskError && (
                        <div className="mb-3 p-2 text-xs bg-red-900/40 border border-red-500 text-red-100 rounded">
                            {taskError}
                        </div>
                    )}

                    <div className="flex-1 rounded-lg bg-slate-900/40 border border-slate-800 p-4 overflow-y-auto">
                        {assignedCases.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-sm text-slate-500">
                                No alerts or tasks assigned to you yet.
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {assignedCases.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center gap-6 rounded-lg px-4 py-4 border border-slate-700 bg-blue-900/40"
                                    >
                                        <span className="text-lg px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500 text-blue-100 font-bold">
                                            PLAN
                                        </span>

                                        <div className="w-px h-8 bg-slate-400/30"></div>

                                        <div className="font-bold">{item.alert?.status || "ALERT"}</div>

                                        <div className="w-px h-8 bg-slate-400/30"></div>

                                        <div className="font-semibold">{item.alert?.machine || item.title}</div>

                                        <div className="w-px h-8 bg-slate-400/30"></div>

                                        <div className="text-sm text-slate-400">
                                            <span>{item.alert?.parameter}</span>
                                            <span className="mx-2">{item.alert?.value} (thr {item.alert?.threshold})</span>
                                        </div>

                                        <div className="flex-1"></div>

                                        <button
                                            type="button"
                                            className="text-xs px-3 py-1 rounded border border-sky-500 text-sky-100 hover:bg-sky-500/10"
                                            onClick={() => navigate(`/manager/cases/${item.id}`)}
                                        >
                                            Details
                                        </button>

                                        <button
                                            type="button"
                                            className="text-xs px-3 py-1 rounded border border-red-500 bg-red-600/20 text-red-100 hover:bg-red-500/10 disabled:opacity-50"
                                            onClick={() => handleRemoveCase(item.id)}
                                            disabled={removingId === item.id}
                                        >
                                            {removingId === item.id ? "Removing..." : "Remove"}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ManagerDashboardPage;
