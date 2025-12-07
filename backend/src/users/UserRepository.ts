import { db } from "../db/Connection";
import type { NewUser } from "../models/User";

export async function createUser(newUser: NewUser): Promise<number> {
    const [result] = await db.execute(
        `INSERT INTO USERS (EMAIL, FIRSTNAME, LASTNAME, PASSWORD_HASH, ROLE)
         VALUES (?, ?, ?, ?, ?)`,
        [newUser.email, newUser.firstName, newUser.lastName, newUser.passwordHash, newUser.role]
    );
    const insertResult = result as { insertId: number };
    return insertResult.insertId;
}   