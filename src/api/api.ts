import axios from "axios";
import { Todo, MetaResponse, FilterStatus, TodoRequest, TodoInfo } from "../types/types";

const API_URL = "https://easydev.club/api/v1/todos";

export const fetchTodos = async (filter: FilterStatus): Promise<MetaResponse<Todo, TodoInfo>> => {
    const url = `${API_URL}?filter=${filter}`;
    const response = await axios.get<MetaResponse<Todo, TodoInfo>>(url);
    return response.data;
};

export const createTodo = async (todo: TodoRequest): Promise<Todo> => {
    const response = await axios.post<Todo>(API_URL, todo);
    return response.data;
};

export const updateTodo = async (id: number, updated: TodoRequest): Promise<Todo> => {
    const response = await axios.put<Todo>(`${API_URL}/${id}`, updated);
    return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
