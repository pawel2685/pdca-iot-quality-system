export interface Task {
    id: string;
    title: string;
    progressPercent: number;
}

export const mockTasks: Task[] = [
    {
        id: "1",
        title: "Identify root cause",
        progressPercent: 100,
    },
    {
        id: "2",
        title: "Develop solution",
        progressPercent: 75,
    },
    {
        id: "3",
        title: "Test solution",
        progressPercent: 50,
    },
    {
        id: "4",
        title: "Implement changes",
        progressPercent: 25,
    },
    {
        id: "5",
        title: "Monitor results",
        progressPercent: 0,
    },
];
