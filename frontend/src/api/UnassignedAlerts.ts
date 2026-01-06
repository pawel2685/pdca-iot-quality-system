import type { Alert } from "../types/Alert";
import { API_BASE_URL } from "../config/ApiConfig";
import { DATA_MODE } from "../config/DataMode";
import { getLocalAlerts } from "./LocalAlerts";

export async function getUnassignedAlerts(days: number): Promise<Alert[]> {
    if (DATA_MODE === "local") {
        const allAlerts = await getLocalAlerts();
        return allAlerts.filter((a) => a.state === "NOT ASSIGNED");
    }

    const response = await fetch(`${API_BASE_URL}/api/alerts?state=NOT%20ASSIGNED&days=${days}`);

    if (!response.ok) {
        throw new Error("Failed to fetch unassigned alerts");
    }

    const data = (await response.json()) as Alert[];
    return data;
}
