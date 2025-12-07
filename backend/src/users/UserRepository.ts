import { db } from "../db/Connection";
import type { NewUser, User } from "../models/User";

export async function createUser(newUser: NewUser): Promise<number> {
    const [result] = await db.execute(
        `INSERT INTO USERS (EMAIL, FIRSTNAME, LASTNAME, PASSWORD_HASH, ROLE)
         VALUES (?, ?, ?, ?, ?)`,
        [newUser.email, newUser.firstName, newUser.lastName, newUser.passwordHash, newUser.role]
    );
    const insertResult = result as { insertId: number };
    return insertResult.insertId;
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const [rows] = await db.query(
        `SELECT ID, EMAIL, FIRSTNAME, LASTNAME, PASSWORD_HASH, ROLE, CREATED_AT, UPDATED_AT
         FROM USERS WHERE EMAIL = ?`,
        [email]
    );
    const resultRows = rows as User[];
    if (resultRows.length === 0) {
        return null;
    }

    const row = resultRows[0];

    const user: User = {
        id: row.id,
        email: row.email,
        firstName: row.firstName,
        lastName: row.lastName,
        passwordHash: row.passwordHash,
        role: row.role,
        createDate: row.createDate,
        updateDate: row.updateDate,
    };

    return user;
}