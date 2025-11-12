import { AxiosError } from "axios";

type ServerError = { message?: string };

export const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof AxiosError) {
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