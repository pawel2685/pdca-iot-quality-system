import type { MqttMessage } from "../models/MqttMessage";
import type { Alert } from "../models/Alert";

export function mapMqttMessageToAlert(msg: MqttMessage): Alert {
  const id = `${msg.machine}-${msg.parameter}-${msg.timestamp}`;

  return {
    id,
    status: msg.status,
    parameter: msg.parameter,
    value: msg.value,
    threshold: msg.threshold,
    timestamp: msg.timestamp,
    machine: msg.machine,
    state: "NOT ASSIGNED",
  };
}
