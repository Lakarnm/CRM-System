import { http } from "./httpClient";
import { User, UserFilters, UsersMetaResponse, UserRolesRequest, UserRequest } from "../types/types";

const TOO_MANY_REQUESTS_STATUS = 429;
const RETRY_DELAY_MS = 2000;

export async function fetchUsers(filters: UserFilters): Promise<UsersMetaResponse> {
    const apiParams: any = { ...filters };

    Object.keys(apiParams).forEach(key => {
        const value = apiParams[key];
        if (value === undefined || value === "" || value === null) {
            delete apiParams[key];
        }
    });

    try {
        const { data } = await http.get<UsersMetaResponse>("/admin/users", {
            params: apiParams
        });
        return data;
    } catch (error: any) {
        if (error.response?.status === TOO_MANY_REQUESTS_STATUS) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            throw new Error('Слишком много запросов. Подождите немного.');
        }
        throw error;
    }
}

export async function fetchUserById(id: number): Promise<User> {
    const { data } = await http.get<User>(`/admin/users/${id}`);
    return data;
}

export async function updateUserRoles(id: number, payload: UserRolesRequest): Promise<User> {
    const { data } = await http.post<User>(`/admin/users/${id}/rights`, payload);
    return data;
}

export async function updateUser(id: number, payload: UserRequest): Promise<User> {
    const { data } = await http.put<User>(`/admin/users/${id}`, payload);
    return data;
}

export async function blockUser(id: number): Promise<User> {
    const { data } = await http.post<User>(`/admin/users/${id}/block`);
    return data;
}

export async function unblockUser(id: number): Promise<User> {
    const { data } = await http.post<User>(`/admin/users/${id}/unblock`);
    return data;
}

export async function deleteUser(id: number): Promise<void> {
    await http.delete(`/admin/users/${id}`);
}