export type PdcaPhase = "PLAN" | "DO" | "CHECK" | "ACT" | "CLOSED";
export type PdcaStatus = "ACTIVE" | "CANCELLED" | "COMPLETED";
export type PdcaCaseType = "ALERT" | "TASK";

export interface PdcaCase {
    id: number;
    alertId: string | null;
    title: string;
    description: string | null;
    ownerUserId: number;
    createdByUserId: number;
    phase: PdcaPhase;
    status: PdcaStatus;
    caseType: PdcaCaseType;
    createDate: Date;
    updateDate: Date;
}

export interface CreatePdcaCaseFromAlertInput {
    alertId: string;
    ownerUserId: number;
    createdByUserId: number;
    title?: string;
    description?: string | null;
}

export interface CreatePdcaCaseFromTaskInput {
    title: string;
    description?: string | null;
    ownerUserId: number;
    createdByUserId: number;
}
