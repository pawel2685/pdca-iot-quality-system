import type { Alert } from "../types/Alert";
import { API_BASE_URL } from "../config/ApiConfig";
import { DATA_MODE } from "../config/DataMode";
import { getLocalAlerts } from "./LocalAlerts";

export async function getLiveAlerts(): Promise<Alert[]> {
  if (DATA_MODE === "local") {
    return getLocalAlerts();
  }

  const response = await fetch(`${API_BASE_URL}/api/live-alerts`);

  if (!response.ok) {
    throw new Error("Failed to fetch live alerts");
  }

  const data = (await response.json()) as Alert[];
  return data;
}
