import { createMqttClient } from "./mqtt/MqttClient";
import { startHttpServer } from "./http/server";
import { db } from "./db/Connection";   

console.log("Backend PDCA / MQTT startuje");

async function testDb() {
  try {
    const [rows] = await db.query("SELECT 1 AS OK");
    console.log("DB test OK:", rows);
  } catch (err) {
    console.error("DB test error:", (err as Error).message);
  }
}

testDb();

const mqttClient = createMqttClient();
startHttpServer(4000);
