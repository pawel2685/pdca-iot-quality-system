import type { Alert } from "../types/Alert";
import { DATA_MODE } from "../config/DataMode";
import { getLocalAlerts } from "./LocalAlerts";
import { getLiveAlerts } from "./LiveAlerts";

export async function getAlerts(): Promise<Alert[]> {
  if (DATA_MODE === "local") {
    return getLocalAlerts();
  }

  return getLiveAlerts();
}
