export interface Todo {
    id: number;
    title: string;
    isDone: boolean;
}

export interface TodoInfo {
    all: number;
    completed: number;
    inWork: number;
}

export interface TodoRequest {
    title?: string;
    isDone?: boolean;
}

export interface MetaResponse<T, N = undefined> {
    data: T[];
    info?: N,
    meta: {
        totalAmount: number;
    }
}

export type FilterStatus = "all" | "completed" | "inWork";