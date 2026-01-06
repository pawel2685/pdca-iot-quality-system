import express from "express";
import { getLiveAlerts } from "../alerts/LiveAlertsStore";
import { authRouter } from "./routes/AuthRoutes";
import { pdcaRouter } from "./routes/PdcaRoutes";
import { alertsRouter } from "./routes/AlertsRoutes";

export function startHttpServer(port: number) {
  const app = express();

  app.use(express.json());

  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

  app.use((_req, res, next) => {
    if (_req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      return res.sendStatus(200);
    }
    next();
  });

  app.use("/auth", authRouter);

  app.use("/pdca", pdcaRouter);

  app.use("/api", alertsRouter);

  app.get("/api/live-alerts", (_req, res) => {
    const alerts = getLiveAlerts();
    res.json(alerts);
  });

  app.listen(port, () => {
    console.log(`HTTP server listening on port ${port}`);
  });
}
