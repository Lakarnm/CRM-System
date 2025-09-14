import { initAsyncParticle, type IAsyncParticle } from "./utils";
import type { Profile } from "../types/types";

export type AuthSliceState = {
    profile: IAsyncParticle<Profile | null>;
    accessToken: string | null;
    refreshToken: string | null;
    error: string | null;
    isReady: boolean;
    isAuthorization: boolean;
};

export const authInitialState: AuthSliceState = {
    profile: initAsyncParticle<Profile | null>(null),
    accessToken: null,
    refreshToken: localStorage.getItem("refreshToken"),
    error: null,
    isReady: false,
    isAuthorization: false,
};