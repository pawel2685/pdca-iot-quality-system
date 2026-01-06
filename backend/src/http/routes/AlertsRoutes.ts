import { Router } from "express";
import { getUnassignedAlertsLastDays } from "../../alerts/AlertsRepository";

export const alertsRouter = Router();

alertsRouter.get("/alerts", async (req, res) => {
    const state = req.query.state as string;
    const daysParam = req.query.days as string;

    if (!state) {
        return res.status(400).json({ message: "state query parameter is required" });
    }

    if (state !== "NOT ASSIGNED") {
        return res.status(400).json({ message: "state parameter must be 'NOT ASSIGNED'" });
    }

    const days = daysParam ? parseInt(daysParam, 10) : 7;

    if (isNaN(days) || days < 1) {
        return res.status(400).json({ message: "days parameter must be a positive number" });
    }

    try {
        const alerts = await getUnassignedAlertsLastDays(days);
        console.log(`Fetched ${alerts.length} unassigned alerts for last ${days} days`);
        return res.json(alerts);
    } catch (err) {
        console.error("Error fetching unassigned alerts:", (err as Error).message);
        return res.status(500).json({ message: "Internal server error" });
    }
});
