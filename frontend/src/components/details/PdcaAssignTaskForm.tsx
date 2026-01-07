import { useState } from "react";
import type { TeamType } from "./PeopleMock";
import { peopleByTeam } from "./PeopleMock";

interface PdcaAssignTaskFormProps {
    onSubmit: (title: string, team: TeamType, assigneeId: string, assigneeName: string) => void;
}

function PdcaAssignTaskForm({ onSubmit }: PdcaAssignTaskFormProps) {
    const [title, setTitle] = useState("");
    const [team, setTeam] = useState<TeamType>("MAINTENANCE");
    const [assigneeId, setAssigneeId] = useState("");
    const [description, setDescription] = useState("");

    const teamList: TeamType[] = ["MAINTENANCE", "QUALITY", "PRODUCTION"];
    const selectedTeamMembers = peopleByTeam[team];
    const selectedAssignee = selectedTeamMembers.find((p) => p.id === assigneeId);

    const isFormValid = title.trim() !== "" && assigneeId !== "";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid || !selectedAssignee) return;

        onSubmit(title, team, assigneeId, selectedAssignee.name);

        setTitle("");
        setTeam("MAINTENANCE");
        setAssigneeId("");
        setDescription("");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="w-full px-3 py-2 text-sm rounded bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Team</label>
                <select
                    value={team}
                    onChange={(e) => {
                        setTeam(e.target.value as TeamType);
                        setAssigneeId("");
                    }}
                    className="w-full px-3 py-2 text-sm rounded bg-slate-700 border border-slate-600 text-slate-100 focus:outline-none focus:border-blue-500"
                >
                    <option value="">Select team...</option>
                    {teamList.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Assignee</label>
                <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    disabled={!team}
                    className="w-full px-3 py-2 text-sm rounded bg-slate-700 border border-slate-600 text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="">Select assignee...</option>
                    {selectedTeamMembers.map((person) => (
                        <option key={person.id} value={person.id}>
                            {person.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional task description"
                    rows={3}
                    className="w-full px-3 py-2 text-sm rounded bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={!isFormValid}
                className="w-full px-4 py-2 text-sm font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Przypisz
            </button>
        </form>
    );
}

export default PdcaAssignTaskForm;
