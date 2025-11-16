import express from "express";
import { getLiveAlerts } from "../alerts/LiveAlertsStore";

export function startHttpServer(port: number) {
  const app = express();

  // Enable CORS for frontend
  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

  app.get("/api/live-alerts", (_req, res) => {
    const alerts = getLiveAlerts();
    res.json(alerts);
  });

  app.listen(port, () => {
    console.log(`HTTP server listening on port ${port}`);
  });
}
