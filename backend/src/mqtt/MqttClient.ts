import mqtt from "mqtt";
import { MQTT_URL } from "../config/MqttConfig";
import { mapMqttMessageToAlert } from "./MapMqttToAlert";
import type { MqttMessage } from "../models/MqttMessage";
import { addLiveAlert } from "../alerts/LiveAlertsStore";


export function createMqttClient() {
    const client = mqtt.connect(MQTT_URL);

    client.on("connect", () => {
        console.log("MQTT connected to", MQTT_URL);

        client.subscribe("TestMachine001/#", (err) => {
            if (err) {
                console.error("MQTT subscribe error:", err.message);
            } else {
                console.log("MQTT subscribed to TestMachine001/#");
            }
        });
    });

    client.on("message", (topic, payload) => {
        try {
            const json = JSON.parse(payload.toString()) as MqttMessage;
            const alert = mapMqttMessageToAlert(json);
            addLiveAlert(alert);
            console.log("MQTT alert stored:", topic, alert.id);
        } catch (err) {
            console.error("MQTT message parse error:", (err as Error).message);
        }
    });

    client.on("error", (err) => {
        console.error("MQTT error:", err.message);
    });

    return client;
}
