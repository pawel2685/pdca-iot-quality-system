export type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "DONE" | "REJECTED";
export type PhaseType = "PLAN" | "DO" | "CHECK" | "ACT";

export interface Task {
    id: string;
    title: string;
    assigneeName: string;
    status: TaskStatus;
    progressPercent: number;
    phase: PhaseType;
}

export const mockTasks: Task[] = [
    {
        id: "1",
        title: "Identify root cause",
        assigneeName: "John Smith",
        status: "DONE",
        progressPercent: 100,
        phase: "PLAN",
    },
    {
        id: "2",
        title: "Develop solution",
        assigneeName: "Jane Doe",
        status: "IN_PROGRESS",
        progressPercent: 75,
        phase: "DO",
    },
    {
        id: "3",
        title: "Test solution",
        assigneeName: "Mike Johnson",
        status: "IN_PROGRESS",
        progressPercent: 50,
        phase: "DO",
    },
    {
        id: "4",
        title: "Implement changes",
        assigneeName: "Sarah Wilson",
        status: "NOT_STARTED",
        progressPercent: 25,
        phase: "CHECK",
    },
    {
        id: "5",
        title: "Monitor results",
        assigneeName: "Tom Brown",
        status: "NOT_STARTED",
        progressPercent: 0,
    },
];
