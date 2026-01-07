import type { Task } from "../data/MockTasks";

interface PdcaCaseHeaderProps {
    phase: string;
    tasks: Task[];
    onBack?: () => void;
    onFinishPhase?: () => void;
}

function PdcaCaseHeader({ phase, tasks, onBack, onFinishPhase }: PdcaCaseHeaderProps) {
    const progressPercent = tasks.length > 0
        ? Math.round(tasks.reduce((sum, task) => sum + task.progressPercent, 0) / tasks.length)
        : 0;

    const phaseColors: Record<string, { bg: string; border: string; text: string }> = {
        PLAN: { bg: "bg-blue-600/20", border: "border-blue-500", text: "text-blue-100" },
        DO: { bg: "bg-green-600/20", border: "border-green-500", text: "text-green-100" },
        CHECK: { bg: "bg-amber-600/20", border: "border-amber-500", text: "text-amber-100" },
        ACT: { bg: "bg-purple-600/20", border: "border-purple-500", text: "text-purple-100" },
    };

    const colors = phaseColors[phase] || phaseColors.PLAN;

    return (
        <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-8 mb-6">
            <div className="flex items-center gap-8 justify-between">
                <div className="flex items-center gap-8 flex-1">
                    <div className={`${colors.bg} border ${colors.border} rounded-lg px-6 py-4 min-w-fit`}>
                        <div className="text-xs text-slate-400 mb-2">Phase</div>
                        <div className={`text-3xl font-bold ${colors.text}`}>{phase}</div>
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-base text-slate-400 font-medium">Overall Progress</span>
                            <span className="text-lg font-bold text-slate-200">{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                {(onBack || onFinishPhase) && (
                    <div className="flex flex-col gap-3">
                        {onBack && (
                            <button
                                type="button"
                                className="px-4 py-2 rounded border border-slate-500 text-slate-100 hover:bg-slate-700 transition-colors"
                                onClick={onBack}
                            >
                                Back
                            </button>
                        )}
                        {onFinishPhase && (
                            <button
                                type="button"
                                className="px-4 py-2 rounded border border-green-500 text-green-100 hover:bg-green-500/10 transition-colors"
                                onClick={onFinishPhase}
                            >
                                Finish phase
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PdcaCaseHeader;
