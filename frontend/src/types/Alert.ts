export type AlertStatus = "ALERT" | "WARNING" | "INFO";

export type PDCAPhase = "PLAN" | "DO" | "CHECK" | "ACT" | null;

export interface Alert {
  id: string;
  status: AlertStatus;
  parameter: string;
  value: number;
  threshold: number;
  timestamp: string;
  machine: string;
  assignee?: string;
  pdcaPhase?: PDCAPhase;
}
