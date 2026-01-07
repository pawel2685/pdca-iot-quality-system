import type { Task, TaskStatus } from "../../data/MockTasks";

interface PdcaTasksPanelProps {
  tasks: Task[];
  onMarkTaskDone: (taskId: string) => void;
}

function PdcaTasksPanel({ tasks, onMarkTaskDone }: PdcaTasksPanelProps) {
  const statusLabels: Record<TaskStatus, string> = {
    NOT_STARTED: "Not Started",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
    REJECTED: "Rejected",
  };

  const statusColors: Record<TaskStatus, { bg: string; border: string; text: string }> = {
    NOT_STARTED: { bg: "bg-slate-600/20", border: "border-slate-500", text: "text-slate-100" },
    IN_PROGRESS: { bg: "bg-blue-600/20", border: "border-blue-500", text: "text-blue-100" },
    DONE: { bg: "bg-green-600/20", border: "border-green-500", text: "text-green-100" },
    REJECTED: { bg: "bg-red-600/20", border: "border-red-500", text: "text-red-100" },
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const colors = statusColors[task.status];

        return (
          <div key={task.id} className="rounded-lg bg-slate-800/50 border border-slate-700 p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-100 text-sm mb-1">{task.title}</h4>
                <p className="text-xs text-slate-400">{task.assigneeName}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${colors.bg} border ${colors.border} ${colors.text} whitespace-nowrap ml-2`}>
                {statusLabels[task.status]}
              </span>
            </div>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-400">Progress</span>
                <span className="text-xs font-semibold text-slate-200">{task.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${task.progressPercent}%` }}
                />
              </div>
            </div>

            {task.status !== "DONE" && task.status !== "REJECTED" && (
              <button
                type="button"
                className="w-full px-3 py-2 text-xs font-semibold rounded bg-green-600/20 border border-green-500 text-green-100 hover:bg-green-600/40 transition-colors"
                onClick={() => onMarkTaskDone(task.id)}
              >
                Mark Done
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PdcaTasksPanel;
