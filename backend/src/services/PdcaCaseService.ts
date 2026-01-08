import { db } from "../db/Connection";
import type { ResultSetHeader } from "mysql2";
import type {
    CreatePdcaCaseFromAlertInput,
    CreatePdcaCaseFromTaskInput,
    PdcaCase,
} from "../models/PdcaCase";

export async function createPdcaCaseFromAlert(
    input: CreatePdcaCaseFromAlertInput
): Promise<PdcaCase> {
    const title =
        input.title ?? `PDCA for alert ${input.alertId}`;
    const description = input.description ?? null;

    const [result] = await db.execute(
        `
      INSERT INTO PDCA_CASES
        (ALERT_ID, TITLE, DESCRIPTION, OWNER_USER_ID, CREATED_BY_USER_ID, PHASE, STATUS, CASE_TYPE)
      VALUES
        (?, ?, ?, ?, ?, 'PLAN', 'ACTIVE', 'ALERT')
    `,
        [
            input.alertId,
            title,
            description,
            input.ownerUserId,
            input.createdByUserId,
        ]
    );

    const insertedId = (result as ResultSetHeader).insertId as number;

    const [rows] = await db.execute(
        `
      SELECT
        ID,
        ALERT_ID,
        TITLE,
        DESCRIPTION,
        OWNER_USER_ID,
        CREATED_BY_USER_ID,
        PHASE,
        STATUS,
        CASE_TYPE,
        CREATE_DATE,
        UPDATE_DATE
      FROM PDCA_CASES
      WHERE ID = ?
    `,
        [insertedId]
    );

    const rowArray = rows as any[];
    const row = rowArray[0];

    const pdcaCase: PdcaCase = {
        id: row.ID,
        alertId: row.ALERT_ID,
        title: row.TITLE,
        description: row.DESCRIPTION,
        ownerUserId: row.OWNER_USER_ID,
        createdByUserId: row.CREATED_BY_USER_ID,
        phase: row.PHASE,
        status: row.STATUS,
        caseType: row.CASE_TYPE,
        createDate: row.CREATE_DATE,
        updateDate: row.UPDATE_DATE,
    };

    return pdcaCase;
}

export async function createPdcaCaseFromTask(
    input: CreatePdcaCaseFromTaskInput
): Promise<PdcaCase> {
    const description = input.description ?? null;

    const [result] = await db.execute(
        `
      INSERT INTO PDCA_CASES
        (ALERT_ID, TITLE, DESCRIPTION, OWNER_USER_ID, CREATED_BY_USER_ID, PHASE, STATUS, CASE_TYPE)
      VALUES
        (NULL, ?, ?, ?, ?, 'PLAN', 'ACTIVE', 'TASK')
    `,
        [
            input.title,
            description,
            input.ownerUserId,
            input.createdByUserId,
        ]
    );

    const insertedId = (result as ResultSetHeader).insertId as number;

    const [rows] = await db.execute(
        `
      SELECT
        ID,
        ALERT_ID,
        TITLE,
        DESCRIPTION,
        OWNER_USER_ID,
        CREATED_BY_USER_ID,
        PHASE,
        STATUS,
        CASE_TYPE,
        CREATE_DATE,
        UPDATE_DATE
      FROM PDCA_CASES
      WHERE ID = ?
    `,
        [insertedId]
    );

    const rowArray = rows as any[];
    const row = rowArray[0];

    const pdcaCase: PdcaCase = {
        id: row.ID,
        alertId: row.ALERT_ID,
        title: row.TITLE,
        description: row.DESCRIPTION,
        ownerUserId: row.OWNER_USER_ID,
        createdByUserId: row.CREATED_BY_USER_ID,
        phase: row.PHASE,
        status: row.STATUS,
        caseType: row.CASE_TYPE,
        createDate: row.CREATE_DATE,
        updateDate: row.UPDATE_DATE,
    };

    return pdcaCase;
}
