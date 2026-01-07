import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import PdcaCaseHeader from "../components/PdcaCaseHeader";
import PdcaStatusTimeline from "../components/details/PdcaStatusTimeline";
import { useAuth } from "../auth/AuthContext";
import { getPdcaCaseDetails, type PdcaCaseDetailsResponse } from "../api/PdcaCases";
import { mockTasks } from "../data/MockTasks";
import { eventsMock } from "../components/details/EventsMock";

function PdcaCaseDetailsPage() {
    const { caseId } = useParams<{ caseId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<PdcaCaseDetailsResponse | null>(null);

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
                    setData(result);
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

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
            <AppHeader title="PDCA Case Details" />
            <main className="flex-1">
                {data && !loading && (
                    <div className="px-6 py-0">
                        <PdcaCaseHeader phase={data.case.phase} tasks={mockTasks} />
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

                        {data && !loading && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-1 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                                            <PdcaStatusTimeline events={eventsMock} />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-bold">{data.case.title}</h2>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${data.case.phase === "PLAN" ? "bg-blue-600/20 border border-blue-500 text-blue-100" :
                                            data.case.phase === "DO" ? "bg-green-600/20 border border-green-500 text-green-100" :
                                                data.case.phase === "CHECK" ? "bg-amber-600/20 border border-amber-500 text-amber-100" :
                                                    "bg-purple-600/20 border border-purple-500 text-purple-100"
                                            }`}>
                                            {data.case.phase}
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Case ID:</span>
                                            <span className="font-semibold">{data.case.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Status:</span>
                                            <span className="font-semibold">{data.case.status}</span>
                                        </div>
                                        {data.case.description && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-slate-400">Description:</span>
                                                <p className="font-semibold text-slate-200">{data.case.description}</p>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Created:</span>
                                            <span className="font-semibold">{new Date(data.case.createDate).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Updated:</span>
                                            <span className="font-semibold">{new Date(data.case.updateDate).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {data.alert && (
                                    <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-6">
                                        <h3 className="text-lg font-bold mb-4">Alert Details</h3>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Alert ID:</span>
                                                <span className="font-semibold">{data.alert.id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Machine:</span>
                                                <span className="font-semibold">{data.alert.machine}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Parameter:</span>
                                                <span className="font-semibold">{data.alert.parameter}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Value:</span>
                                                <span className={`font-semibold ${data.alert.status === "ALERT" ? "text-red-400" : "text-amber-400"}`}>
                                                    {data.alert.value}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Threshold:</span>
                                                <span className="font-semibold">{data.alert.threshold}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Status:</span>
                                                <span className={`font-semibold ${data.alert.status === "ALERT" ? "text-red-100" : "text-amber-100"
                                                    }`}>
                                                    {data.alert.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Timestamp:</span>
                                                <span className="font-semibold">{new Date(data.alert.timestamp).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded border border-slate-500 text-slate-100 hover:bg-slate-700 transition-colors"
                                        onClick={() => navigate("/manager")}
                                    >
                                        Back
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PdcaCaseDetailsPage;
