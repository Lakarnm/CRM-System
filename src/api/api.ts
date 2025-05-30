import { Todo, TodoInfo } from "../types/types.js";

const API_URL = "https://easydev.club/api/v1/todos";

async function fetchTodos(filter: string = "all"): Promise<{ todos: Todo[]; info: TodoInfo }> {
    const response = await fetch(`${API_URL}?filter=${filter}`);
    if (!response.ok) {
        throw new Error("Failed to fetch todos");
    }
    const data = await response.json();
    return { todos: data.data, info: data.info };
}

async function addTodo(title: string): Promise<void> {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, isDone: false }),
    });
    if (!response.ok) {
        throw new Error("Failed to add todo");
    }
}

async function updateTodo(id: number, title: string, isDone: boolean): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, isDone }),
    });
    if (!response.ok) {
        throw new Error("Failed to update todo");
    }
}

async function deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (response.status === 404) {
        throw new Error("Todo not found");
    }
}

export { addTodo, updateTodo, deleteTodo, fetchTodos };



