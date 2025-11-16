export interface MqttMessage {
  status: "ALERT" | "WARNING";
  parameter: string;
  value: number;
  threshold: number;
  timestamp: string;
  machine: string;
}
