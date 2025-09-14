import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { AuthData, UserRegistration, Token, RefreshToken, Profile } from "../../types/types";
import {
    loginUser,
    registerUser,
    refreshToken as apiRefreshToken,
    getProfile as apiGetProfile,
    logoutUser as apiLogoutUser,
    setAccessToken as setApiAccessToken,
} from "../../api/api";

import { addAsyncBuilderCases, initAsyncParticle } from "../../store/utils";
import { authInitialState, type AuthSliceState } from "../../store/initialState";

/* THUNKS */
export const register = createAsyncThunk<Profile, UserRegistration, { rejectValue: string }>(
    "auth/register",
    async (payload, { rejectWithValue }) => {
        try {
            return await registerUser(payload);
        } catch (err: any) {
            const status = err?.response?.status;
            const raw = err?.response?.data;
            const text = typeof raw === "string" ? raw : raw?.message || "";
            if (status === 409) return rejectWithValue(text || "Логин или email уже заняты");
            if (status === 400) return rejectWithValue(text || "Некорректные данные регистрации");
            return rejectWithValue(text || "Ошибка регистрации");
        }
    }
);

export const login = createAsyncThunk<Token, AuthData, { rejectValue: string }>(
    "auth/login",
    async (payload, { rejectWithValue }) => {
        try {
            const tokens = await loginUser(payload);
            localStorage.setItem("refreshToken", tokens.refreshToken);
            return tokens;
        } catch (err: any) {
            const raw = err?.response?.data;
            return rejectWithValue(typeof raw === "string" ? raw : "Неверные логин или пароль");
        }
    }
);

export const refreshAccess = createAsyncThunk<Token, void, { rejectValue: string }>(
    "auth/refreshAccess",
    async (_, { rejectWithValue }) => {
        try {
            const stored = localStorage.getItem("refreshToken");
            if (!stored) throw new Error("Нет refresh токена");
            const payload: RefreshToken = { refreshToken: stored };
            return await apiRefreshToken(payload);
        } catch {
            return rejectWithValue("Сессия истекла");
        }
    }
);

export const fetchProfileThunk = createAsyncThunk<Profile, void, { rejectValue: string }>(
    "auth/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            return await apiGetProfile();
        } catch (err: any) {
            const raw = err?.response?.data;
            return rejectWithValue(typeof raw === "string" ? raw : "Ошибка загрузки профиля");
        }
    }
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await apiLogoutUser();
            localStorage.removeItem("refreshToken");
        } catch (err: any) {
            const raw = err?.response?.data;
            return rejectWithValue(typeof raw === "string" ? raw : "Ошибка выхода");
        }
    }
);

export const initAuth = createAsyncThunk("auth/initAuth", async (_, { dispatch }) => {
    const hasRefresh = !!localStorage.getItem("refreshToken");
    if (!hasRefresh) {
        dispatch(setReady(true));
        return;
    }
    try {
        const t = await dispatch(refreshAccess()).unwrap();
        setApiAccessToken(t.accessToken);
        await dispatch(fetchProfileThunk());
    } catch {
        setApiAccessToken(null);
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
    extraReducers: (b) => {
        // REGISTER
        b.addCase(register.rejected, (s, a) => {
            s.error = (a.payload as string) || "Ошибка регистрации";
        });

        // LOGIN
        b.addCase(login.fulfilled, (s, a: PayloadAction<Token>) => {
            s.accessToken = a.payload.accessToken;
            s.refreshToken = a.payload.refreshToken;
            s.isAuthorization = true;
            setApiAccessToken(a.payload.accessToken);
            s.error = null;
        });
        b.addCase(login.rejected, (s, a) => {
            s.isAuthorization = false;
            s.error = (a.payload as string) || "Ошибка входа";
        });

        // REFRESH
        b.addCase(refreshAccess.fulfilled, (s, a: PayloadAction<Token>) => {
            s.accessToken = a.payload.accessToken;
            s.refreshToken = a.payload.refreshToken;
            s.isAuthorization = true;
            localStorage.setItem("refreshToken", a.payload.refreshToken);
            setApiAccessToken(a.payload.accessToken);
            s.error = null;
        });
        b.addCase(refreshAccess.rejected, (s) => {
            s.profile = initAsyncParticle<Profile | null>(null);
            s.accessToken = null;
            s.refreshToken = null;
            s.isAuthorization = false;
            localStorage.removeItem("refreshToken");
            setApiAccessToken(null);
        });

        // PROFILE
        addAsyncBuilderCases(b, fetchProfileThunk, "profile");

        // LOGOUT
        b.addCase(logout.fulfilled, (s) => {
            s.profile = initAsyncParticle<Profile | null>(null);
            s.accessToken = null;
            s.refreshToken = null;
            s.isAuthorization = false;
            setApiAccessToken(null);
        });
    },
});

export const { clearError, setReady } = authSlice.actions;
export default authSlice.reducer;
