import { db } from "../db/Connection";
import type { Alert } from "../models/Alert";

export interface PdcaCaseWithAlert {
    case: {
        id: number;
        alertId: string | null;
        title: string;
        description: string | null;
        ownerUserId: number;
        createdByUserId: number;
        phase: string;
        status: string;
        caseType: string;
        createDate: string;
        updateDate: string;
    };
    alert: Alert | null;
}

export async function getPdcaCaseWithAlert(caseId: number): Promise<PdcaCaseWithAlert | null> {
    const query = `
    SELECT
      pc.ID as caseId,
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
    WHERE pc.ID = ?
  `;

    const [rows] = await db.execute(query, [caseId]);

    if (!Array.isArray(rows) || rows.length === 0) {
        return null;
    }

    const row = rows[0] as any;

    const pdcaCase: PdcaCaseWithAlert = {
        case: {
            id: row.caseId,
            alertId: row.alertId,
            title: row.title,
            description: row.description,
            ownerUserId: row.ownerUserId,
            createdByUserId: row.createdByUserId,
            phase: row.phase,
            status: row.status,
            caseType: row.caseType,
            createDate: row.createDate instanceof Date ? row.createDate.toISOString() : String(row.createDate),
            updateDate: row.updateDate instanceof Date ? row.updateDate.toISOString() : String(row.updateDate),
        },
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
    };

    return pdcaCase;
}
