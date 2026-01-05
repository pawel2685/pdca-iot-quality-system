import { Router } from "express";
import { createPdcaCaseFromAlert } from "../../services/PdcaCaseService";

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
