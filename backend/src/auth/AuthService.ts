import bcrypt from "bcrypt"
import type { NewUser } from "../models/User"
import { createUser } from "../users/UserRepository"

const DEFAULT_ROLE = "OPERATOR"
const SALT_ROUNDS = 10

export interface SignUpInput {
    email: string
    firstName: string
    lastName: string
    password: string
}   

export async function registerUser(input: SignUpInput): Promise<number> {
    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const newUser: NewUser = {
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        passwordHash,
        role: DEFAULT_ROLE
    };

    const userId = await createUser(newUser);
    return userId;
}