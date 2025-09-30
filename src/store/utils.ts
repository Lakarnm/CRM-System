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