import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import PdcaCaseHeader from "../components/PdcaCaseHeader";
import PdcaStatusTimeline from "../components/details/PdcaStatusTimeline";
import PdcaTasksPanel from "../components/details/PdcaTasksPanel";
import PdcaAssignTaskForm from "../components/details/PdcaAssignTaskForm";
import { useAuth } from "../auth/AuthContext";
import { getPdcaCaseDetails, type PdcaCaseDetailsResponse } from "../api/PdcaCases";
import { getAlertById } from "../api/Alerts";
import { mockTasks, type Task } from "../data/MockTasks";
import { eventsMock, type CaseEvent } from "../components/details/EventsMock";
import type { TeamType } from "../components/details/PeopleMock";
import type { Alert } from "../types/Alert";

function PdcaCaseDetailsPage() {
    const { caseId } = useParams<{ caseId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<PdcaCaseDetailsResponse | null>(null);
    const [alert, setAlert] = useState<Alert | null>(null);
    const [tasks, setTasks] = useState<Task[]>(mockTasks);
    const [events, setEvents] = useState<CaseEvent[]>(eventsMock);

    useEffect(() => {
        let isMounted = true;

        async function loadCaseDetails() {
            if (!caseId || !user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const result = await getPdcaCaseDetails(caseId, user.id);
                if (isMounted) {
                    console.log("Loaded case details:", result);
                    setData(result);

                    if (result.alert) {
                        console.log("Alert from response:", result.alert);
                        setAlert(result.alert);
                    } else if (result.case.alertId) {
                        console.log("Fetching alert by ID:", result.case.alertId);
                        const fetchedAlert = await getAlertById(result.case.alertId);
                        console.log("Fetched alert:", fetchedAlert);
                        if (isMounted && fetchedAlert) {
                            setAlert(fetchedAlert);
                        }
                    } else {
                        console.log("No alert or alertId found");
                    }
                }
            } catch (err) {
                if (isMounted) {
                    const message = err instanceof Error ? err.message : "Failed to load case details";
                    setError(message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadCaseDetails();

        return () => {
            isMounted = false;
        };
    }, [caseId, user]);

    const handleMarkTaskDone = (taskId: string) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId
                    ? { ...task, status: "DONE" as const, progressPercent: 100 }
                    : task
            )
        );

        const task = tasks.find((t) => t.id === taskId);
        if (task) {
            const newEvent: CaseEvent = {
                id: `event-${Date.now()}`,
                type: "TASK_DONE",
                message: `${task.title} - Completed`,
                timestamp: new Date().toISOString(),
            };
            setEvents((prevEvents) => [newEvent, ...prevEvents]);
        }
    };

    const handleAssignTask = (title: string, _team: TeamType, _assigneeId: string, assigneeName: string) => {
        const newTask: Task = {
            id: `task-${Date.now()}`,
            title,
            assigneeName,
            status: "NOT_STARTED",
            progressPercent: 0,
        };

        setTasks((prevTasks) => [...prevTasks, newTask]);

        const newEvent: CaseEvent = {
            id: `event-${Date.now()}`,
            type: "TASK_CREATED",
            message: `Dodano zadanie: ${title} → ${assigneeName}`,
            timestamp: new Date().toISOString(),
        };
        setEvents((prevEvents) => [newEvent, ...prevEvents]);
    };

    const displayAlert = alert || {
        id: "ALERT-2026-001",
        status: "ALERT" as const,
        machine: "Pump-Unit-A3",
        parameter: "Pressure",
        value: 8.5,
        threshold: 4.4,
        timestamp: new Date().toISOString(),
        state: "ASSIGNED" as const,
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
            <AppHeader title="PDCA Case Details" alert={displayAlert} />

            <main className="flex-1">
                {data && !loading && (
                    <div className="px-6 py-0">
                        <PdcaCaseHeader
                            phase={data.case.phase}
                            tasks={tasks}
                            onBack={() => navigate("/manager")}
                            onFinishPhase={() => { }}
                        />
                    </div>
                )}
                <div className="p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {loading && (
                            <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-6 text-center">
                                <p className="text-slate-400">Loading...</p>
                            </div>
                        )}

                        {error && !loading && (
                            <div className="rounded-lg bg-red-900/40 border border-red-500 p-6">
                                <p className="text-red-100 font-semibold mb-3">Error</p>
                                <p className="text-red-200 text-sm mb-4">{error}</p>
                                <button
                                    type="button"
                                    className="px-3 py-1 text-sm rounded border border-red-500 text-red-100 hover:bg-red-500/10"
                                    onClick={() => navigate("/manager")}
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {data && !loading && (
                    <>
                        <div className="px-6 py-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                                        <PdcaStatusTimeline events={events} />
                                    </div>
                                </div>

                                <div className="md:col-span-1">
                                    {user && (user.role === "MANAGER" || user.role === "SUPERVISOR") ? (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Przypisz zadanie</h3>
                                            <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-4">
                                                <PdcaAssignTaskForm onSubmit={handleAssignTask} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-4">
                                            <p className="text-sm text-slate-400">Brak uprawnień do przypisywania zadań</p>
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-1 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Tasks</h3>
                                        <PdcaTasksPanel tasks={tasks} onMarkTaskDone={handleMarkTaskDone} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default PdcaCaseDetailsPage;
