import type { Alert } from "../types/Alert";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export async function getLiveAlerts(): Promise<Alert[]> {
  const response = await fetch(`${BASE_API_URL}/live-alerts`);

  if (!response.ok) {
    throw new Error("Failed to fetch live alerts");
  }

  const data = (await response.json()) as Alert[];
  return data;
}
