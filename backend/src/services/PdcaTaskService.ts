import { db } from "../db/Connection";
import type { PdcaTaskWithAssignee, CreateTaskRequest, UpdateTaskRequest, CaseEvent, PdcaDetailsResponse } from "../models/PdcaTask";

export async function getPdcaDetails(caseId: number, userId: number): Promise<PdcaDetailsResponse | null> {
    try {
        const caseQuery = `
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
            WHERE pc.ID = ? AND pc.OWNER_USER_ID = ?
        `;

        const [caseRows] = await db.execute(caseQuery, [caseId, userId]);

        if (!Array.isArray(caseRows) || caseRows.length === 0) {
            return null;
        }

        const caseRow = (caseRows as any)[0];
        const pdcaCase = {
            id: caseRow.id,
            alertId: caseRow.alertId,
            title: caseRow.title,
            description: caseRow.description,
            ownerUserId: caseRow.ownerUserId,
            createdByUserId: caseRow.createdByUserId,
            phase: caseRow.phase,
            status: caseRow.status,
            caseType: caseRow.caseType,
            createDate: caseRow.createDate,
            updateDate: caseRow.updateDate,
        };

        const alert = caseRow.alertId2 ? {
            id: caseRow.alertId2,
            machine: caseRow.machine,
            parameter: caseRow.parameter,
            value: caseRow.value,
            threshold: caseRow.threshold,
            status: caseRow.alertStatus,
            state: caseRow.state,
            timestamp: caseRow.timestamp,
        } : null;

        const tasksQuery = `
            SELECT 
                pt.ID as id,
                pt.CASE_ID as caseId,
                pt.TITLE as title,
                pt.DESCRIPTION as description,
                pt.PHASE as phase,
                pt.STATUS as status,
                pt.PROGRESS_PERCENT as progressPercent,
                pt.WEIGHT_PERCENT as weightPercent,
                pt.CREATED_AT as createdAt,
                pt.UPDATED_AT as updatedAt,
                p.ID as personId,
                p.NAME as personName,
                p.TEAM as team
            FROM PDCA_TASKS pt
            LEFT JOIN PDCA_TASK_PEOPLE_ASSIGNEES ptpa ON pt.ID = ptpa.TASK_ID AND ptpa.ROLE = 'EXECUTOR'
            LEFT JOIN PEOPLE p ON ptpa.PERSON_ID = p.ID
            WHERE pt.CASE_ID = ? AND pt.PHASE = ?
            ORDER BY pt.CREATED_AT ASC
        `;

        const [taskRows] = await db.execute(tasksQuery, [caseId, caseRow.phase]);
        const tasks = (Array.isArray(taskRows) ? taskRows : []).map((row: any) => ({
            id: row.id,
            caseId: row.caseId,
            title: row.title,
            description: row.description,
            phase: row.phase,
            status: row.status,
            progressPercent: row.progressPercent,
            weightPercent: row.weightPercent,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            assigneePersonId: row.personId,
            assigneeName: row.personName,
            team: row.team,
        }));

        const eventsQuery = `
            SELECT 
                ID as id,
                CASE_ID as caseId,
                TYPE as type,
                MESSAGE as message,
                CREATED_AT as timestamp
            FROM PDCA_CASE_EVENTS
            WHERE CASE_ID = ?
            ORDER BY CREATED_AT DESC
        `;

        const [eventRows] = await db.execute(eventsQuery, [caseId]);
        const events = (Array.isArray(eventRows) ? eventRows : []).map((row: any) => ({
            id: row.id,
            caseId: row.caseId,
            type: row.type,
            message: row.message,
            timestamp: row.timestamp,
        }));

        const phaseProgressPercent = tasks.length > 0
            ? Math.round(tasks.reduce((sum, t) => sum + (t.weightPercent * t.progressPercent / 100), 0) / tasks.reduce((sum, t) => sum + t.weightPercent, 0) * 100)
            : 0;

        return {
            case: pdcaCase,
            alert,
            currentPhase: caseRow.phase,
            tasks,
            events,
            phaseProgressPercent,
        };
    } catch (error) {
        throw error;
    }
}

export async function createTask(caseId: number, req: CreateTaskRequest, userId: number): Promise<PdcaTaskWithAssignee> {
    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        const caseQuery = `SELECT PHASE, OWNER_USER_ID FROM PDCA_CASES WHERE ID = ?`;
        const [caseRows] = await conn.execute(caseQuery, [caseId]);

        if (!Array.isArray(caseRows) || caseRows.length === 0) {
            throw new Error("Case not found");
        }

        const caseData = (caseRows as any)[0];
        const phase = caseData.PHASE;

        const phaseQuery = `SELECT CLOSED_AT FROM PDCA_CASE_PHASES WHERE CASE_ID = ? AND PHASE_NAME = ?`;
        const [phaseRows] = await conn.execute(phaseQuery, [caseId, phase]);

        if (Array.isArray(phaseRows) && (phaseRows as any)[0]?.CLOSED_AT) {
            throw new Error("Phase is closed");
        }

        const personQuery = `SELECT ID, NAME FROM PEOPLE WHERE ID = ? AND TEAM = ?`;
        const [personRows] = await conn.execute(personQuery, [req.assigneePersonId, req.team]);

        if (!Array.isArray(personRows) || personRows.length === 0) {
            throw new Error("Person not found in team");
        }

        const personData = (personRows as any)[0];

        const insertTaskQuery = `
            INSERT INTO PDCA_TASKS (CASE_ID, TITLE, DESCRIPTION, PHASE, STATUS, PROGRESS_PERCENT, WEIGHT_PERCENT, CREATED_AT, UPDATED_AT)
            VALUES (?, ?, ?, ?, 'NOT_STARTED', 0, 20, NOW(), NOW())
        `;
        const [taskResult] = await conn.execute(insertTaskQuery, [caseId, req.title, req.description || null, phase]);
        const taskId = (taskResult as any).insertId;

        const assignQuery = `
            INSERT INTO PDCA_TASK_PEOPLE_ASSIGNEES (TASK_ID, PERSON_ID, ROLE, ASSIGNED_AT)
            VALUES (?, ?, 'EXECUTOR', NOW())
        `;
        await conn.execute(assignQuery, [taskId, req.assigneePersonId]);

        const eventQuery = `
            INSERT INTO PDCA_CASE_EVENTS (CASE_ID, TYPE, MESSAGE, CREATED_AT)
            VALUES (?, 'TASK_CREATED', ?, NOW())
        `;
        const message = `Zadanie '${req.title}' przypisane do ${personData.NAME}`;
        await conn.execute(eventQuery, [caseId, message]);

        await conn.commit();

        return {
            id: taskId,
            caseId,
            title: req.title,
            description: req.description || null,
            phase: phase as any,
            status: "NOT_STARTED",
            progressPercent: 0,
            weightPercent: 20,
            createdAt: new Date(),
            updatedAt: new Date(),
            assigneePersonId: req.assigneePersonId,
            assigneeName: personData.NAME,
            team: req.team,
        };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

export async function updateTask(taskId: number, req: UpdateTaskRequest, userId: number): Promise<any> {
    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        const taskQuery = `SELECT CASE_ID, PHASE, TITLE FROM PDCA_TASKS WHERE ID = ?`;
        const [taskRows] = await conn.execute(taskQuery, [taskId]);

        if (!Array.isArray(taskRows) || taskRows.length === 0) {
            throw new Error("Task not found");
        }

        const taskData = (taskRows as any)[0];
        const { CASE_ID: caseId, PHASE: phase, TITLE: title } = taskData;

        const phaseCheckQuery = `SELECT CLOSED_AT FROM PDCA_CASE_PHASES WHERE CASE_ID = ? AND PHASE_NAME = ?`;
        const [phaseCheckRows] = await conn.execute(phaseCheckQuery, [caseId, phase]);

        if (Array.isArray(phaseCheckRows) && (phaseCheckRows as any)[0]?.CLOSED_AT) {
            throw new Error("Phase is closed");
        }

        if (req.progressPercent !== undefined && (req.progressPercent < 0 || req.progressPercent > 100)) {
            throw new Error("Progress must be between 0 and 100");
        }

        const updateFields = [];
        const updateValues = [];

        if (req.status) {
            updateFields.push("STATUS = ?");
            updateValues.push(req.status);
        }

        if (req.progressPercent !== undefined) {
            updateFields.push("PROGRESS_PERCENT = ?");
            updateValues.push(req.progressPercent);
        }

        updateFields.push("UPDATED_AT = NOW()");

        if (updateFields.length > 1) {
            const updateQuery = `UPDATE PDCA_TASKS SET ${updateFields.join(", ")} WHERE ID = ?`;
            updateValues.push(taskId);
            await conn.execute(updateQuery, updateValues);
        }

        let eventType = "TASK_UPDATED";
        let message = `Zadanie '${title}' - Progress: ${req.progressPercent || 0}%`;

        if (req.status === "DONE" || req.progressPercent === 100) {
            eventType = "TASK_DONE";
            message = `Zadanie '${title}' ukończone`;
        }

        const eventQuery = `
            INSERT INTO PDCA_CASE_EVENTS (CASE_ID, TYPE, MESSAGE, CREATED_AT)
            VALUES (?, ?, ?, NOW())
        `;
        await conn.execute(eventQuery, [caseId, eventType, message]);

        await conn.commit();

        return {
            id: taskId,
            status: req.status,
            progressPercent: req.progressPercent,
            updatedAt: new Date(),
        };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}
