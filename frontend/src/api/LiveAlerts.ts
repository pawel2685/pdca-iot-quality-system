import type { Alert } from "../types/Alert";

export async function getLiveAlerts(): Promise<Alert[]> {
  const response = await fetch("http://localhost:4000/api/live-alerts");

  if (!response.ok) {
    throw new Error("Failed to fetch live alerts");
  }

  const data = (await response.json()) as Alert[];
  return data;
}
