export type AlertStatus = "ALERT" | "WARNING";
export type AlertState = "NOT ASSIGNED" | "ASSIGNED";

export interface Alert {
  id: string;
  status: AlertStatus;
  parameter: string;
  value: number;
  threshold: number;
  timestamp: string;
  machine: string;
  state: AlertState;
}
