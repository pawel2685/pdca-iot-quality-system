import { Router } from "express";
import { createPdcaCaseFromAlert, createPdcaCaseFromTask } from "../../services/PdcaCaseService";
import { getPdcaCaseWithAlert } from "../../services/PdcaCaseDetailsService";
import { getPdcaDetails, createTask, updateTask } from "../../services/PdcaTaskService";
import { db } from "../../db/Connection";
import type { CreateTaskRequest, UpdateTaskRequest } from "../../models/PdcaTask";

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

pdcaRouter.post("/cases/task", async (req, res) => {
    const { title, description, ownerUserId, createdByUserId } = req.body ?? {};

    if (!title) {
        return res.status(400).json({ message: "title is required" });
    }

    if (!ownerUserId || !createdByUserId) {
        return res.status(400).json({ message: "ownerUserId and createdByUserId are required" });
    }

    try {
        const pdcaCase = await createPdcaCaseFromTask({
            title,
            description: description ?? null,
            ownerUserId,
            createdByUserId,
        });

        return res.status(201).json(pdcaCase);
    } catch (err) {
        console.error("Error creating PDCA task case:", (err as Error).message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

pdcaRouter.get("/cases", async (req, res) => {
    const userId = req.query.userId ? parseInt(req.query.userId as string, 10) : null;
    const phase = req.query.phase as string | undefined;

    if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: "userId query parameter is required" });
    }

    const phaseFilter = phase || "PLAN";

    try {
        const query = `
      SELECT
        pc.ID as id,
        pc.ALERT_ID as alertId,
        pc.TITLE as title,
        pc.DESCRIPTION as description,
        pc.OWNER_USER_ID as ownerUserId,
        pc.CREATED_BY_USER_ID as createdByUserId,
        pc.PHASE as phase,
        pc.STATUS as status,
        pc.CASE_TYPE as caseType,
        pc.CREATE_DATE as createDate,
        pc.UPDATE_DATE as updateDate,
        a.ID as alertId2,
        a.STATUS as alertStatus,
        a.PARAMETER as parameter,
        a.VALUE as value,
        a.THRESHOLD as threshold,
        a.TIMESTAMP as timestamp,
        a.MACHINE as machine,
        a.STATE as state
      FROM PDCA_CASES pc
      LEFT JOIN ALERTS a ON pc.ALERT_ID = a.ID
      WHERE pc.OWNER_USER_ID = ? AND pc.PHASE = ?
      ORDER BY pc.CREATE_DATE DESC
    `;

        const [rows] = await db.execute(query, [userId, phaseFilter]);

        const cases = (rows as any[]).map((row) => ({
            id: row.id,
            caseType: row.caseType,
            alertId: row.alertId,
            title: row.title,
            description: row.description,
            ownerUserId: row.ownerUserId,
            phase: row.phase,
            status: row.status,
            createDate: row.createDate instanceof Date ? row.createDate.toISOString() : String(row.createDate),
            updateDate: row.updateDate instanceof Date ? row.updateDate.toISOString() : String(row.updateDate),
            alert: row.alertId2 ? {
                id: String(row.alertId2),
                status: row.alertStatus,
                parameter: row.parameter,
                value: Number(row.value),
                threshold: Number(row.threshold),
                timestamp: row.timestamp instanceof Date ? row.timestamp.toISOString() : String(row.timestamp),
                machine: row.machine,
                state: row.state,
            } : null,
        }));

        return res.json(cases);
    } catch (err) {
        console.error("Error fetching PDCA cases:", (err as Error).message);
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

pdcaRouter.get("/cases/:caseId/details", async (req, res) => {
    const caseId = parseInt(req.params.caseId, 10);
    const userId = req.query.userId ? parseInt(req.query.userId as string, 10) : null;

    if (isNaN(caseId)) {
        return res.status(400).json({ message: "caseId must be a number" });
    }

    if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: "userId query parameter is required" });
    }

    try {
        const details = await getPdcaDetails(caseId, userId);

        if (!details) {
            return res.status(404).json({ message: "PDCA case not found or access denied" });
        }

        return res.json(details);
    } catch (err) {
        console.error("Error fetching PDCA case details:", (err as Error).message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

pdcaRouter.post("/cases/:caseId/tasks", async (req, res) => {
    const caseId = parseInt(req.params.caseId, 10);
    const { title, description, team, assigneePersonId } = req.body ?? {};
    const userRole = (req as any).user?.role;
    const userId = (req as any).user?.id;

    if (isNaN(caseId)) {
        return res.status(400).json({ message: "caseId must be a number" });
    }

    if (!title || !team || assigneePersonId === undefined) {
        return res.status(400).json({ message: "title, team, and assigneePersonId are required" });
    }

    if (!userRole || !["MANAGER", "SUPERVISOR"].includes(userRole)) {
        return res.status(403).json({ message: "Only MANAGER or SUPERVISOR can create tasks" });
    }

    try {
        const task = await createTask(caseId, {
            title,
            description: description || null,
            team,
            assigneePersonId,
        } as CreateTaskRequest, userId);

        return res.status(201).json(task);
    } catch (err) {
        const errMsg = (err as Error).message;
        if (errMsg.includes("not found")) {
            return res.status(404).json({ message: errMsg });
        }
        if (errMsg.includes("closed")) {
            return res.status(409).json({ message: errMsg });
        }
        if (errMsg.includes("team")) {
            return res.status(422).json({ message: errMsg });
        }
        console.error("Error creating task:", errMsg);
        return res.status(500).json({ message: "Internal server error" });
    }
});

pdcaRouter.patch("/tasks/:taskId", async (req, res) => {
    const taskId = parseInt(req.params.taskId, 10);
    const { status, progressPercent } = req.body ?? {};
    const userRole = (req as any).user?.role;
    const userId = (req as any).user?.id;

    if (isNaN(taskId)) {
        return res.status(400).json({ message: "taskId must be a number" });
    }

    if (progressPercent !== undefined && (typeof progressPercent !== "number" || progressPercent < 0 || progressPercent > 100)) {
        return res.status(400).json({ message: "progressPercent must be a number between 0 and 100" });
    }

    if (!userRole || !["FOREMAN", "MANAGER", "SUPERVISOR"].includes(userRole)) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    try {
        if (userRole === "FOREMAN") {
            const taskQuery = `
                SELECT pt.ID, pt.CASE_ID, ptpa.PERSON_ID, p.TEAM
                FROM PDCA_TASKS pt
                LEFT JOIN PDCA_TASK_PEOPLE_ASSIGNEES ptpa ON pt.ID = ptpa.TASK_ID AND ptpa.ROLE = 'EXECUTOR'
                LEFT JOIN PEOPLE p ON ptpa.PERSON_ID = p.ID
                WHERE pt.ID = ?
            `;
            const [taskRows] = await db.execute(taskQuery, [taskId]);

            if (!Array.isArray(taskRows) || taskRows.length === 0) {
                return res.status(404).json({ message: "Task not found" });
            }

            const taskData = (taskRows as any)[0];
            const team = taskData.TEAM;

            const foremanQuery = `SELECT FOREMAN_USER_ID FROM TEAMS WHERE NAME = ?`;
            const [foremanRows] = await db.execute(foremanQuery, [team]);

            if (!Array.isArray(foremanRows) || foremanRows.length === 0) {
                return res.status(403).json({ message: "Team not found" });
            }

            const foremanId = (foremanRows as any)[0].FOREMAN_USER_ID;
            if (foremanId !== userId) {
                return res.status(403).json({ message: "You are not the foreman of this team" });
            }
        }

        const result = await updateTask(taskId, {
            status,
            progressPercent,
        } as UpdateTaskRequest, userId);

        return res.json(result);
    } catch (err) {
        const errMsg = (err as Error).message;
        if (errMsg.includes("not found")) {
            return res.status(404).json({ message: errMsg });
        }
        if (errMsg.includes("closed")) {
            return res.status(409).json({ message: errMsg });
        }
        if (errMsg.includes("Progress")) {
            return res.status(400).json({ message: errMsg });
        }
        console.error("Error updating task:", errMsg);
        return res.status(500).json({ message: "Internal server error" });
    }
});
