import bcrypt from "bcrypt"
import type { NewUser } from "../models/User"
import { createUser, findUserByEmail } from "../users/UserRepository"

const DEFAULT_ROLE = "OPERATOR"
const SALT_ROUNDS = 10

export interface SignUpInput {
    email: string
    firstName: string
    lastName: string
    password: string
}   

export interface LoginInput {
    email: string
    password: string
}

export interface AuthenticatedUser {
    id: number
    email: string
    firstName: string
    lastName: string
    role: string
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

export async function loginUser(input: LoginInput): Promise<AuthenticatedUser> {

    const user = await findUserByEmail(input.email);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
    };
}