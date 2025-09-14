import type { ActionReducerMapBuilder, PayloadAction } from "@reduxjs/toolkit";

export type AsyncStatus = "idle" | "pending" | "fulfilled" | "rejected";

export interface IAsyncParticle<T> {
    data: T | null;
    error: string | null;
    errorCounter: number;
    status: AsyncStatus;
}

export const initAsyncParticle = <T>(data: T | null = null): IAsyncParticle<T> => ({
    data,
    error: null,
    errorCounter: 0,
    status: "idle",
});

export const addAsyncBuilderCases = <TState, TData>(
    builder: ActionReducerMapBuilder<TState>,
    thunk: any,
    key: keyof TState
) => {
    builder.addCase(thunk.pending, (state: any) => {
        const node = state[key] as IAsyncParticle<TData>;
        node.status = "pending";
        node.error = null;
    });
    builder.addCase(thunk.fulfilled, (state: any, action: PayloadAction<TData>) => {
        const node = state[key] as IAsyncParticle<TData>;
        node.status = "fulfilled";
        node.error = null;
        node.errorCounter = 0;
        node.data = (action.payload ?? null) as any;
    });
    builder.addCase(thunk.rejected, (state: any, action: any) => {
        const node = state[key] as IAsyncParticle<TData>;
        node.status = "rejected";
        node.error =
            (action?.payload as string) ||
            action?.error?.message ||
            "Ошибка запроса";
        node.errorCounter = (node.errorCounter ?? 0) + 1;
    });
};

export const getAsyncDataStatus = (p?: IAsyncParticle<unknown>) => ({
    hasError: p?.status === "rejected",
    isIdle: p?.status === "idle",
    isLoading: p?.status === "pending",
    isLoadingOrIdle: p?.status === "pending" || p?.status === "idle",
    isLoaded: p?.status === "fulfilled",
    isLoadedOrError: p?.status === "fulfilled" || p?.status === "rejected",
});

export const getAsyncRequestData = <T>(p: IAsyncParticle<T>) => ({
    data: p?.data ?? null as T | null,
    error: p?.error ?? null,
    errorCounter: p?.errorCounter ?? 0,
    status: getAsyncDataStatus(p),
});

