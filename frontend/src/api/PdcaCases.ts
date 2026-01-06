import { API_BASE_URL } from '../config/ApiConfig';
import type { Alert } from '../types/Alert';

export interface CreatePdcaCaseResponse {
    id: number;
    alertId: string;
    title: string;
    description: string | null;
    ownerUserId: number;
    createdByUserId: number;
    phase: string;
    status: string;
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
        createDate: string;
        updateDate: string;
    };
    alert: Alert | null;
}

export async function createPdcaCaseFromAlert(alertId: string, userId: number): Promise<CreatePdcaCaseResponse> {
    const response = await fetch(`${API_BASE_URL}/pdca/cases/from-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId, ownerUserId: userId, createdByUserId: userId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
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