import { API_BASE_URL } from '../config/ApiConfig';

export async function createPdcaCaseFromAlert(alertId: string, userId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/pdca/cases/from-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId, ownerUserId: userId, createdByUserId: userId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
}