export type EventType = "NOTE_ADDED" | "TASK_CREATED" | "TASK_DONE" | "PHASE_CHANGED" | "STATUS_UPDATED" | "CASE_CREATED";

export interface CaseEvent {
    id: string;
    type: EventType;
    message: string;
    timestamp: string;
}

export const eventsMock: CaseEvent[] = [
    {
        id: "1",
        type: "TASK_DONE",
        message: "Identify root cause - Completed",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "2",
        type: "NOTE_ADDED",
        message: "Pressure valve shows signs of wear, replacement recommended within 2 weeks",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "3",
        type: "TASK_CREATED",
        message: "Develop solution - New task assigned",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "4",
        type: "PHASE_CHANGED",
        message: "Phase changed from DO to CHECK",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "5",
        type: "TASK_CREATED",
        message: "Test solution - New task assigned",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "6",
        type: "CASE_CREATED",
        message: "PDCA case created from alert",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
];
