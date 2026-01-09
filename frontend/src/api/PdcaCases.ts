import { API_BASE_URL } from '../config/ApiConfig';
import type { Alert } from '../types/Alert';

export type PdcaCaseType = "ALERT" | "TASK";

export interface CreatePdcaCaseResponse {
    id: number;
    alertId: string | null;
    title: string;
    description: string | null;
    ownerUserId: number;
    createdByUserId: number;
    phase: string;
    status: string;
    caseType: PdcaCaseType;
    createDate: string;
    updateDate: string;
}

export interface PdcaCaseDetailsResponse {
    case: {
        id: number;
        alertId: string | null;
        title: string;
        description: string | null;
        ownerUserId: number;
        createdByUserId: number;
        phase: string;
        status: string;
        caseType: PdcaCaseType;
        createDate: string;
        updateDate: string;
    };
    alert: Alert | null;
}

export interface PdcaCaseListItem {
    id: number;
    caseType: PdcaCaseType;
    alertId: string | null;
    title: string;
    description: string | null;
    ownerUserId: number;
    phase: string;
    status: string;
    createDate: string;
    updateDate: string;
    alert: Alert | null;
}

export async function createPdcaCaseFromAlert(
    alertId: string,
    userId: number,
    alertData?: { status: string; parameter: string; value: number; threshold: number; machine: string }
): Promise<CreatePdcaCaseResponse> {
    const response = await fetch(`${API_BASE_URL}/pdca/cases/from-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            alertId,
            ownerUserId: userId,
            createdByUserId: userId,
            ...(alertData && { alertData }),
        }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
    }

    return response.json();
}

export async function getPdcaCaseDetails(caseId: string, userId: number): Promise<PdcaCaseDetailsResponse> {
    const response = await fetch(`${API_BASE_URL}/pdca/cases/${caseId}?userId=${userId}`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return response.json();
}

export async function createPdcaCaseFromTask(
    title: string,
    userId: number,
    description?: string
): Promise<CreatePdcaCaseResponse> {
    const response = await fetch(`${API_BASE_URL}/pdca/cases/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title,
            description: description || null,
            ownerUserId: userId,
            createdByUserId: userId,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return response.json();
}

export async function getPdcaCasesList(userId: number, phase?: string): Promise<PdcaCaseListItem[]> {
    const params = new URLSearchParams({ userId: String(userId) });
    if (phase) {
        params.append("phase", phase);
    }
    const response = await fetch(`${API_BASE_URL}/pdca/cases?${params.toString()}`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return response.json();
}