import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const BASE_URL = "https://easydev.club/api/v1";

class AccessTokenStore {
    private _token: string | null = null;

    get(): string | null {
        return this._token;
    }
    set(value: string | null): void {
        this._token = value;
    }
    clear(): void {
        this._token = null;
    }
}

export const tokenStore = new AccessTokenStore();
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
export const http: AxiosInstance = axios.create({ baseURL: BASE_URL });

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
    const subscribers = refreshSubscribers.splice(0);
    for (const subscriber of subscribers) {
        try {
            subscriber(newAccessToken);
        } catch (error) {
            console.error("[refresh] subscriber failed:", error);
        }
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
                    const { data } = await http.post<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
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