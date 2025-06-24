import { Todo, TodoInfo, MetaResponse, FilterStatus, TodoRequest } from "../types/types.js";

const API_URL = "https://easydev.club/api/v1/todos";

async function fetchTodos(filter: FilterStatus = "all"): Promise<MetaResponse<Todo, TodoInfo>> {
    const response = await fetch(`${API_URL}?filter=${filter}`);
    if (!response.ok) throw new Error("Failed to fetch todos");
    return await response.json() as MetaResponse<Todo, TodoInfo>;
}

async function addTodo(todo: TodoRequest): Promise<Todo> {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error("Failed to add todo");
    return await response.json() as Todo;
}

async function updateTodo(id: number, update: TodoRequest): Promise<Todo> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
    });
    if (!response.ok) throw new Error("Failed to update todo");
    return await response.json() as Todo;
}

async function deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete todo");
}

export { fetchTodos, addTodo, updateTodo, deleteTodo };





