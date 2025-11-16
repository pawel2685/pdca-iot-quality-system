import { createMqttClient } from "./mqtt/MqttClient";
import { startHttpServer } from "./http/server";

console.log("Backend PDCA / MQTT startuje");

const mqttClient = createMqttClient();
startHttpServer(4000);
