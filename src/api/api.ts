import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { UserRegistration, AuthData, RefreshToken, Profile, Token, // AUTH
        Todo, TodoInfo, MetaResponse, TodoRequest, FilterStatus, // TODOS
} from "../types/types";

const BASE_URL = "https://easydev.club/api/v1";

class AccessTokenStore {
    private _token: string | null = null;
    get = () => this._token;
    set = (t: string | null) => {
        this._token = t;
    };
    clear = () => {
        this._token = null;
    };
}
export const tokenStore = new AccessTokenStore();
export const setAccessToken = (t: string | null) => tokenStore.set(t);

let isRefreshing = false;
type Subscriber = (token: string | null) => void;
const subscribers: Subscriber[] = [];
const subscribe = (cb: Subscriber) => subscribers.push(cb);
const flush = (token: string | null) => {
    while (subscribers.length) subscribers.shift()!(token);
};

const http: AxiosInstance = axios.create({
    baseURL: BASE_URL,
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const at = tokenStore.get();
    if (at) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${at}`;
    }
    return config;
});

http.interceptors.response.use(
    (r) => r,
    async (error: AxiosError) => {
        const original = error.config as AxiosRequestConfig & { _retry?: boolean };
        const status = error.response?.status ?? 0;
        const isAuthRefresh = (original?.url ?? "").includes("/auth/refresh");

        if (status === 401 && !original?._retry && !isAuthRefresh) {
            const stored = localStorage.getItem("refreshToken");
            if (!stored) return Promise.reject(error);
            original._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const { data } = await http.post<Token>("/auth/refresh", {
                        refreshToken: stored,
                    });
                    tokenStore.set(data.accessToken);
                    localStorage.setItem("refreshToken", data.refreshToken);
                    isRefreshing = false;
                    flush(tokenStore.get());
                } catch (e) {
                    isRefreshing = false;
                    localStorage.removeItem("refreshToken");
                    tokenStore.clear();
                    flush(null);
                    return Promise.reject(error);
                }
            }

            return new Promise((resolve, reject) => {
                subscribe((token) => {
                    if (token) {
                        original.headers = original.headers ?? {};
                        (original.headers as any).Authorization = `Bearer ${token}`;
                        resolve(http(original));
                    } else {
                        reject(error);
                    }
                });
            });
        }

        return Promise.reject(error);
    }
);

/* AUTH */

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

/* TODOS */

export async function fetchTodos(
    filter: FilterStatus
): Promise<MetaResponse<Todo, TodoInfo>> {
    const params = { status: filter ?? "all" };
    const { data } = await http.get<MetaResponse<Todo, TodoInfo>>("/todos", {
        params,
    });
    return data;
}

export async function createTodo(payload: TodoRequest): Promise<Todo> {
    const { data } = await http.post<Todo>("/todos", payload);
    return data;
}

export async function updateTodo(
    id: number,
    payload: TodoRequest
): Promise<Todo> {
    const { data } = await http.put<Todo>(`/todos/${id}`, payload);
    return data;
}

export async function deleteTodo(id: number): Promise<Todo> {
    const { data } = await http.delete<Todo>(`/todos/${id}`);
    return data;
}

export async function getTodo(id: number): Promise<Todo> {
    const { data } = await http.get<Todo>(`/todos/${id}`);
    return data;
}

export { http };