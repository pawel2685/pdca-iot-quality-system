import type { CaseEvent, EventType } from "./EventsMock";

interface PdcaStatusTimelineProps {
    events: CaseEvent[];
}

function PdcaStatusTimeline({ events }: PdcaStatusTimelineProps) {
    const sortedEvents = [...events].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const eventTypeLabels: Record<EventType, string> = {
        NOTE_ADDED: "Note Added",
        TASK_CREATED: "Task Created",
        TASK_DONE: "Task Completed",
        PHASE_CHANGED: "Phase Changed",
        STATUS_UPDATED: "Status Updated",
        CASE_CREATED: "Case Created",
    };

    const eventTypeColors: Record<EventType, { bg: string; border: string; text: string }> = {
        NOTE_ADDED: { bg: "bg-blue-600/20", border: "border-blue-500", text: "text-blue-100" },
        TASK_CREATED: { bg: "bg-cyan-600/20", border: "border-cyan-500", text: "text-cyan-100" },
        TASK_DONE: { bg: "bg-green-600/20", border: "border-green-500", text: "text-green-100" },
        PHASE_CHANGED: { bg: "bg-purple-600/20", border: "border-purple-500", text: "text-purple-100" },
        STATUS_UPDATED: { bg: "bg-amber-600/20", border: "border-amber-500", text: "text-amber-100" },
        CASE_CREATED: { bg: "bg-slate-600/20", border: "border-slate-500", text: "text-slate-100" },
    };

    return (
        <div className="space-y-3">
            {sortedEvents.map((event) => {
                const colors = eventTypeColors[event.type];
                const date = new Date(event.timestamp);
                const formattedDateTime = date.toLocaleString("pl-PL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                });

                return (
                    <div key={event.id} className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
                        <div className="flex items-start justify-between mb-2">
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${colors.bg} border ${colors.border} ${colors.text}`}>
                                {eventTypeLabels[event.type]}
                            </span>
                            <span className="text-xs text-slate-400">{formattedDateTime}</span>
                        </div>
                        <p className="text-sm text-slate-100">{event.message}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default PdcaStatusTimeline;
