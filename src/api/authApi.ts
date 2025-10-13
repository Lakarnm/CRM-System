import { http, tokenStore } from "./httpClient";
import { UserRegistration, AuthData, RefreshToken, Profile, Token } from "../types/types";

export async function registerUser(payload: UserRegistration): Promise<Profile> {
    const { data } = await http.post<Profile>("/auth/signup", payload);
    return data;
}

export async function loginUser(payload: AuthData): Promise<Token> {
    const { data } = await http.post<Token>("/auth/signin", payload);
    return data;
}

export async function refreshToken(payload: RefreshToken): Promise<Token> {
    const { data } = await http.post<Token>("/auth/refresh", payload);
    return data;
}

export async function getProfile(): Promise<Profile> {
    const { data } = await http.get<Profile>("/user/profile");
    return data;
}

export async function logoutUser(): Promise<void> {
    await http.post("/user/logout");
    localStorage.removeItem("refreshToken");
    tokenStore.clear();
}