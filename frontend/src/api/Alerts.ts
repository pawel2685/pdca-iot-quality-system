import type { Alert } from "../types/Alert";
import { DATA_MODE } from "../config/DataMode";
import { getLocalAlerts } from "./LocalAlerts";

export function getAlerts(): Alert[] {
  if (DATA_MODE === "local") {
    return getLocalAlerts();
  }

  return [];
}
