import type { Alert } from "../types/Alert";

export const mockAlerts: Alert[] = [
  {
    id: "1",
    status: "ALERT",
    parameter: "PRESSURE",
    value: 5.3,
    threshold: 4.4,
    timestamp: "2025-06-15T11:37:00Z",
    machine: "TestMachine001",
    assignee: "Christopher Lambert",
    pdcaPhase: null,
  },
  {
    id: "2",
    status: "ALERT",
    parameter: "TEMPERATURE",
    value: 92.1,
    threshold: 85,
    timestamp: "2025-06-15T10:15:00Z",
    machine: "TestMachine002",
    assignee: "Hugh Jackman",
    pdcaPhase: "PLAN",
  },
  {
    id: "3",
    status: "WARNING",
    parameter: "VIBRATION",
    value: 7.2,
    threshold: 5,
    timestamp: "2025-06-14T18:30:00Z",
    machine: "TestMachine003",
    assignee: "Helen Ripley",
    pdcaPhase: "DO",
  },
];
