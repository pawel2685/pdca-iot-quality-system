export type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "DONE";
export type EventType = "CASE_CREATED" | "TASK_CREATED" | "TASK_UPDATED" | "TASK_DONE" | "PHASE_CHANGED";

export interface PdcaTask {
    id: number;
    caseId: number;
    title: string;
    description: string | null;
    phase: "PLAN" | "DO" | "CHECK" | "ACT";
    status: TaskStatus;
    progressPercent: number;
    weightPercent: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface PdcaTaskWithAssignee extends PdcaTask {
    assigneePersonId: number | null;
    assigneeName: string | null;
    team: string | null;
}

export interface CreateTaskRequest {
    title: string;
    description?: string | null;
    team: string;
    assigneePersonId: number;
}

export interface UpdateTaskRequest {
    status?: TaskStatus;
    progressPercent?: number;
}

export interface CaseEvent {
    id: string;
    caseId: number;
    type: EventType;
    message: string;
    timestamp: string;
}

export interface PdcaDetailsResponse {
    case: {
        id: number;
        alertId: string | null;
        title: string;
        description: string | null;
        ownerUserId: number;
        createdByUserId: number;
        phase: string;
        status: string;
        caseType: string;
        createDate: string;
        updateDate: string;
    };
    alert: any | null;
    currentPhase: string;
    tasks: PdcaTaskWithAssignee[];
    events: CaseEvent[];
    phaseProgressPercent: number;
}
