// ---------- TODOS ----------
export interface Todo {
    id: number;
    title: string;
    created: string; // ISO date string
    isDone: boolean;
}

export interface TodoRequest {
    title?: string;
    isDone?: boolean;
}

export interface TodoInfo {
    all: number;
    completed: number;
    inWork: number;
}

export interface MetaResponse<T, N = undefined> {
    data: T[];
    info?: N;
    meta: {
        totalAmount: number;
    };
}

export type FilterStatus = "all" | "completed" | "inWork";

// ---------- AUTH ----------
export interface UserRegistration {
    login: string;
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
}

export interface AuthData {
    login: string;
    password: string;
}

export interface Token {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshToken {
    refreshToken: string;
}

export type Role = "ADMIN" | "USER" | "MODERATOR";

export interface Profile {
    id: number;
    username: string;
    email: string;
    date: string;
    isBlocked: boolean;
    roles: Role[];
    phoneNumber: string;
}

export interface ProfileRequest {
    username: string;
    email: string;
    phoneNumber: string;
}

export interface PasswordRequest {
    password: string;
}