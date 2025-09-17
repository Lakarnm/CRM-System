import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { UserRegistration, AuthData, RefreshToken, Profile, Token, // AUTH
    Todo, TodoInfo, MetaResponse, TodoRequest, FilterStatus, // TODOS
} from "../types/types";

const BASE_URL = "https://easydev.club/api/v1";

const tokenStore = (() => {
    let token: string | null = null;
    return {
        get(): string | null {
            return token;
        },
        set(value: string | null) {
            token = value;
        },
        clear() {
            token = null;
        },
    };
})();
export const setAccessToken = (value: string | null) => tokenStore.set(value);

/* HEADERS */
function toAxiosHeaders(
    headers: AxiosRequestConfig["headers"] | undefined
): AxiosHeaders {
    return headers instanceof AxiosHeaders ? headers : new AxiosHeaders(headers);
}

function withAuthHeader(
    headers: AxiosRequestConfig["headers"] | undefined,
    accessToken: string
): AxiosHeaders {
    const normalized = toAxiosHeaders(headers);
    normalized.set("Authorization", `Bearer ${accessToken}`);
    return normalized;
}

/* AXIOS */
const http: AxiosInstance = axios.create({ baseURL: BASE_URL });

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = tokenStore.get();
    if (accessToken) {
        config.headers = withAuthHeader(config.headers, accessToken);
    }
    return config;
});

let isRefreshing = false;
type RefreshSubscriber = (newAccessToken: string | null) => void;
const refreshSubscribers: RefreshSubscriber[] = [];

const subscribeRefresh = (subscriber: RefreshSubscriber) => {
    refreshSubscribers.push(subscriber);
};
const notifyRefreshSubscribers = (newAccessToken: string | null) => {
    while (refreshSubscribers.length) {
        const subscriber = refreshSubscribers.shift()!;
        subscriber(newAccessToken);
    }
};

type RetryableConfig =
    | (AxiosRequestConfig & { _retry?: boolean })
    | (InternalAxiosRequestConfig & { _retry?: boolean });

http.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableConfig | undefined;
        const status = error.response?.status ?? 0;
        const isRefreshCall = (originalRequest?.url ?? "").includes("/auth/refresh");

        if (status === 401 && originalRequest && !originalRequest._retry && !isRefreshCall) {
            const storedRefresh = localStorage.getItem("refreshToken");
            if (!storedRefresh) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const { data } = await http.post<Token>("/auth/refresh", {
                        refreshToken: storedRefresh,
                    });

                    tokenStore.set(data.accessToken);
                    localStorage.setItem("refreshToken", data.refreshToken);
                    isRefreshing = false;
                    notifyRefreshSubscribers(data.accessToken);
                } catch {
                    isRefreshing = false;
                    localStorage.removeItem("refreshToken");
                    tokenStore.clear();
                    notifyRefreshSubscribers(null);
                    return Promise.reject(error);
                }
            }

            return new Promise((resolve, reject) => {
                subscribeRefresh((newAccessToken) => {
                    if (newAccessToken) {
                        originalRequest.headers = withAuthHeader(
                            originalRequest.headers,
                            newAccessToken
                        );
                        resolve(http(originalRequest));
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
    const { data } = await http.get<MetaResponse<Todo, TodoInfo>>("/todos", { params });
    return data;
}

export async function createTodo(payload: TodoRequest): Promise<Todo> {
    const { data } = await http.post<Todo>("/todos", payload);
    return data;
}

export async function updateTodo(id: number, payload: TodoRequest): Promise<Todo> {
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
