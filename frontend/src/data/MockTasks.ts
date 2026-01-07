export type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "DONE" | "REJECTED";

export interface Task {
    id: string;
    title: string;
    assigneeName: string;
    status: TaskStatus;
    progressPercent: number;
}

export const mockTasks: Task[] = [
    {
        id: "1",
        title: "Identify root cause",
        assigneeName: "John Smith",
        status: "DONE",
        progressPercent: 100,
    },
    {
        id: "2",
        title: "Develop solution",
        assigneeName: "Jane Doe",
        status: "IN_PROGRESS",
        progressPercent: 75,
    },
    {
        id: "3",
        title: "Test solution",
        assigneeName: "Mike Johnson",
        status: "IN_PROGRESS",
        progressPercent: 50,
    },
    {
        id: "4",
        title: "Implement changes",
        assigneeName: "Sarah Wilson",
        status: "NOT_STARTED",
        progressPercent: 25,
    },
    {
        id: "5",
        title: "Monitor results",
        assigneeName: "Tom Brown",
        status: "NOT_STARTED",
        progressPercent: 0,
    },
];
