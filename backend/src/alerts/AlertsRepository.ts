import { db } from "../db/Connection";
import type { Alert } from "../models/Alert";

export async function getUnassignedAlertsLastDays(days: number): Promise<Alert[]> {
    const query = `
    SELECT ID as id, STATUS as status, PARAMETER as parameter, VALUE as value, 
           THRESHOLD as threshold, TIMESTAMP as timestamp, MACHINE as machine, 
           STATE as state
    FROM ALERTS
    WHERE STATE = 'NOT ASSIGNED'
    AND TIMESTAMP >= DATE_SUB(NOW(), INTERVAL ? DAY)
    ORDER BY TIMESTAMP DESC
  `;

    const [rows] = await db.execute(query, [days]);

    const alerts = (rows as any[]).map((row) => ({
        id: String(row.id),
        status: row.status,
        parameter: row.parameter,
        value: Number(row.value),
        threshold: Number(row.threshold),
        timestamp: row.timestamp instanceof Date ? row.timestamp.toISOString() : String(row.timestamp),
        machine: row.machine,
        state: row.state,
    }));

    return alerts;
}
