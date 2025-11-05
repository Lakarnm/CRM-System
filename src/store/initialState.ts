import { initAsyncParticle, type IAsyncParticle } from "./utils";
import type { Profile } from "../types/types";

export type AuthSliceState = {
    profile: IAsyncParticle<Profile>;
    accessToken: string | null;
    refreshToken: string | null;
    error: string | null;
    isReady: boolean;
    isAuthorized: boolean;
};

export const authInitialState: AuthSliceState = {
    profile: initAsyncParticle<Profile>(null),
    accessToken: null,
    refreshToken: null,
    error: null,
    isReady: false,
    isAuthorized: false,
};