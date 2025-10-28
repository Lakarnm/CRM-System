import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { AuthData, UserRegistration, Token, RefreshToken, Profile } from "../../types/types";
import {
    loginUser,
    registerUser,
    refreshToken as apiRefreshToken,
    getProfile as apiGetProfile,
    logoutUser as apiLogoutUser,
} from "../../api/authApi";
import { tokenStore } from "../../api/httpClient";

import { initAsyncParticle } from "../../store/utils";
import { authInitialState, type AuthSliceState } from "../../store/initialState";

type ServerError = { message?: string };
const extractErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (typeof data === "string") {
            return data;
        }
        const message = (data as ServerError | undefined)?.message;

        if (message) {
            return message;
        }
    }
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return fallback;
};

/* THUNKS */

export const register = createAsyncThunk<Profile, UserRegistration, { rejectValue: string }>(
    "auth/register",
    async (payload, { rejectWithValue }) => {
        try {
            return await registerUser(payload);
        } catch (error: unknown) {
            const message = extractErrorMessage(error, "Ошибка регистрации");
            return rejectWithValue(message);
        }
    }
);

export const login = createAsyncThunk<Token, AuthData, { rejectValue: string }>(
    "auth/login",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            const tokens = await loginUser(payload);
            localStorage.setItem("refreshToken", tokens.refreshToken);
            tokenStore.token = tokens.accessToken;

            const profile = await dispatch(fetchProfileThunk()).unwrap();

            if (profile.isBlocked) {
                localStorage.removeItem("refreshToken");
                tokenStore.clear();
                throw new Error("Пользователь заблокирован");
            }

            return tokens;
        } catch (error: unknown) {
            const message = extractErrorMessage(error, "Неверные логин или пароль");
            return rejectWithValue(message);
        }
    }
);

export const refreshAccess = createAsyncThunk<Token, void, { rejectValue: string }>(
    "auth/refreshAccess",
    async (_, { rejectWithValue }) => {
        try {
            const stored = localStorage.getItem("refreshToken");
            if (!stored) {
                throw new Error("Нет refresh токена");
            }
            const payload: RefreshToken = { refreshToken: stored };
            return await apiRefreshToken(payload);
        } catch (error: unknown) {
            const message = extractErrorMessage(error, "Сессия истекла");
            return rejectWithValue(message);
        }
    }
);

export const fetchProfileThunk = createAsyncThunk<Profile, void, { rejectValue: string }>(
    "auth/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            return await apiGetProfile();
        } catch (error: unknown) {
            const message = extractErrorMessage(error, "Ошибка загрузки профиля");
            return rejectWithValue(message);
        }
    }
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await apiLogoutUser();
            localStorage.removeItem("refreshToken");
        } catch (error: unknown) {
            const message = extractErrorMessage(error, "Ошибка выхода");
            return rejectWithValue(message);
        }
    }
);

export const initAuth = createAsyncThunk("auth/initAuth", async (_, { dispatch, getState }) => {
    const hasRefresh = !!localStorage.getItem("refreshToken");
    if (!hasRefresh) {
        dispatch(setReady(true));
        return;
    }
    try {
        const tokens = await dispatch(refreshAccess()).unwrap();
        tokenStore.token = tokens.accessToken;
        await dispatch(fetchProfileThunk()).unwrap();

        const state = getState() as { auth: AuthSliceState };
        if (state.auth.profile.data?.isBlocked) {
            dispatch(logout());
        }
    } catch (error: any) {
        if (error.response?.status !== 429 && error.response?.status !== 304) {
            tokenStore.clear();
        }
    } finally {
        dispatch(setReady(true));
    }
});

/* SLICE */

const authSlice = createSlice({
    name: "auth",
    initialState: authInitialState as AuthSliceState,
    reducers: {
        clearError(state) {
            state.error = null;
        },
        setReady(state, action: PayloadAction<boolean>) {
            state.isReady = action.payload;
        },
    },
    extraReducers: (builder) => {
        // REGISTER
        builder.addCase(register.rejected, (state, action) => {
            state.error = (action.payload as string) || "Ошибка регистрации";
        });

        // LOGIN
        builder.addCase(login.fulfilled, (state, action: PayloadAction<Token>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthorization = true;
            tokenStore.token = action.payload.accessToken;
            state.error = null;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.isAuthorization = false;
            state.error = (action.payload as string) || "Ошибка входа";
        });

        // REFRESH
        builder.addCase(refreshAccess.fulfilled, (state, action: PayloadAction<Token>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthorization = true;
            localStorage.setItem("refreshToken", action.payload.refreshToken);
            tokenStore.token = action.payload.accessToken;
            state.error = null;
        });
        builder.addCase(refreshAccess.rejected, (state) => {
            state.profile = initAsyncParticle<Profile>(null);
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthorization = false;
            localStorage.removeItem("refreshToken");
            tokenStore.clear();
        });

        // PROFILE
        builder
            .addCase(fetchProfileThunk.pending, (state) => {
                state.profile.status = "pending";
                state.profile.error = null;
            })
            .addCase(fetchProfileThunk.fulfilled, (state, action: PayloadAction<Profile>) => {
                state.profile.status = "fulfilled";
                state.profile.error = null;
                state.profile.errorCounter = 0;
                state.profile.data = action.payload;

                if (action.payload.isBlocked) {
                    state.isAuthorization = false;
                    state.accessToken = null;
                    state.refreshToken = null;
                    tokenStore.clear();
                    localStorage.removeItem("refreshToken");
                }
            })
            .addCase(fetchProfileThunk.rejected, (state, action) => {
                state.profile.status = "rejected";
                const payloadMessage = action.payload as string;
                const errorMessage = payloadMessage || "Ошибка загрузки профиля";
                state.profile.error = errorMessage;
                state.profile.errorCounter = (state.profile.errorCounter ?? 0) + 1;
            });

        // LOGOUT
        builder.addCase(logout.fulfilled, (state) => {
            state.profile = initAsyncParticle<Profile>(null);
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthorization = false;
            tokenStore.clear();
        });
    },
});

export const { clearError, setReady } = authSlice.actions;
export default authSlice.reducer;