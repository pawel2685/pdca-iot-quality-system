export interface NewUser {
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    role: string;
}

export interface User extends NewUser {
    id: number;
    createDate: Date;
    updateDate: Date;
}