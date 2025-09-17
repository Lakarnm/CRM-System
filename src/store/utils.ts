import type { ActionReducerMapBuilder, AsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Draft } from "immer";

export type AsyncStatus = "idle" | "pending" | "fulfilled" | "rejected";

export interface IAsyncParticle<TResult> {
    data: TResult | null;
    error: string | null;
    errorCounter: number;
    status: AsyncStatus;
}

export const initAsyncParticle = <TResult>(initialData: TResult | null = null): IAsyncParticle<TResult> => ({
    data: initialData,
    error: null,
    errorCounter: 0,
    status: "idle",
});

export const addAsyncBuilderCases = < TState, TResult, TArg = void, TRejected = unknown >(
    builder: ActionReducerMapBuilder<TState>,
    thunk: AsyncThunk<TResult, TArg, { rejectValue: TRejected }>,
    selectParticle: (state: Draft<TState>) => IAsyncParticle<TResult>
) => {
    builder.addCase(thunk.pending, (state) => {
        const particle = selectParticle(state);
        particle.status = "pending";
        particle.error = null;
    });

    builder.addCase(thunk.fulfilled, (state, action: PayloadAction<TResult>) => {
        const particle = selectParticle(state);
        particle.status = "fulfilled";
        particle.error = null;
        particle.errorCounter = 0;
        particle.data = action.payload ?? null;
    });

    builder.addCase(thunk.rejected, (state, action) => {
        const particle = selectParticle(state);
        particle.status = "rejected";
        const payloadMessage = (action.payload as unknown as string) ?? undefined;
        const errorMessage =
            payloadMessage ??
            (typeof action.error?.message === "string" ? action.error.message : "Ошибка запроса");
        particle.error = errorMessage;
        particle.errorCounter = (particle.errorCounter ?? 0) + 1;
    });
};

export const getAsyncDataStatus = (particle?: IAsyncParticle<unknown>) => ({
    hasError: particle?.status === "rejected",
    isIdle: particle?.status === "idle",
    isLoading: particle?.status === "pending",
    isLoadingOrIdle: particle?.status === "pending" || particle?.status === "idle",
    isLoaded: particle?.status === "fulfilled",
    isLoadedOrError: particle?.status === "fulfilled" || particle?.status === "rejected",
});

export const getAsyncRequestData = <TResult>(particle: IAsyncParticle<TResult>) => ({
    data: (particle?.data ?? null) as TResult | null,
    error: particle?.error ?? null,
    errorCounter: particle?.errorCounter ?? 0,
    status: getAsyncDataStatus(particle),
});