import { http } from "./httpClient";
import { Todo, TodoInfo, MetaResponse, TodoRequest, FilterStatus } from "../types/types";

export async function fetchTodos(
    filter: FilterStatus
): Promise<MetaResponse<Todo, TodoInfo>> {
    const params = { filter: filter };
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