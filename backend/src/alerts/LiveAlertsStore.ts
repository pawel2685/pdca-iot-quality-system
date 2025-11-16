import type { Alert } from "../models/Alert";

const liveAlerts: Alert[] = [];

export function addLiveAlert(alert: Alert) {
  liveAlerts.push(alert);
}

export function getLiveAlerts(): Alert[] {
  return [...liveAlerts];
}
