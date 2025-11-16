import type { Alert } from "../types/Alert";
import { mockAlerts } from "../data/MockAlerts";

export function getLocalAlerts(): Alert[] {
  return mockAlerts;
}
