import { Router } from "express";
import { createPdcaCaseFromAlert } from "../../services/PdcaCaseService";
import { getPdcaCaseWithAlert } from "../../services/PdcaCaseDetailsService";

export const pdcaRouter = Router();

pdcaRouter.post("/cases/from-alert", async (req, res) => {
    const { alertId, ownerUserId, createdByUserId, title, description } = req.body ?? {};

    if (!alertId || !ownerUserId || !createdByUserId) {
        return res.status(400).json({ message: "alertId, ownerUserId and createdByUserId are required" });
    }

    try {
        const pdcaCase = await createPdcaCaseFromAlert({
            alertId,
            ownerUserId,
            createdByUserId,
            title,
            description,
        });

        return res.status(201).json(pdcaCase);
    } catch (err) {
        console.error("Error creating PDCA case from alert:", (err as Error).message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

pdcaRouter.get("/cases/:caseId", async (req, res) => {
    const caseId = parseInt(req.params.caseId, 10);
    const userId = req.query.userId ? parseInt(req.query.userId as string, 10) : null;

    if (isNaN(caseId)) {
        return res.status(400).json({ message: "caseId must be a number" });
    }

    if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: "userId query parameter is required" });
    }

    try {
        const pdcaCaseWithAlert = await getPdcaCaseWithAlert(caseId);

        if (!pdcaCaseWithAlert) {
            return res.status(404).json({ message: "PDCA case not found" });
        }

        if (pdcaCaseWithAlert.case.ownerUserId !== userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        return res.json(pdcaCaseWithAlert);
    } catch (err) {
        console.error("Error fetching PDCA case details:", (err as Error).message);
        return res.status(500).json({ message: "Internal server error" });
    }
});
