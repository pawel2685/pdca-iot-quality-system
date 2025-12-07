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
        `SELECT ID, EMAIL, FIRSTNAME, LASTNAME, PASSWORD_HASH, ROLE, CREATE_DATE, UPDATE_DATE
         FROM USERS WHERE EMAIL = ?`,
        [email]
    );
    const resultRows = rows as any[];
    if (resultRows.length === 0) {
        return null;
    }

    const row = resultRows[0];

    const user: User = {
        id: row.ID,
        email: row.EMAIL,
        firstName: row.FIRSTNAME,
        lastName: row.LASTNAME,
        passwordHash: row.PASSWORD_HASH,
        role: row.ROLE,
        createDate: row.CREATE_DATE,
        updateDate: row.UPDATE_DATE,
    };

    return user;
}