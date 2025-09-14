import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { Profile } from "../../types/types";
import type { AuthSliceState } from "../../store/initialState";
import { getAsyncRequestData } from "../../store/utils";

export const selectAuthStore = (s: RootState): AuthSliceState => s.auth;

export const selectProfileParticle = createSelector(
    selectAuthStore,
    (s) => s.profile
);

export const selectProfileView = createSelector(
    selectProfileParticle,
    (particle) => getAsyncRequestData<Profile | null>(particle)
);



