import axios from "axios";
import { Todo, MetaResponse, FilterStatus, TodoRequest, TodoInfo } from "../types/types";

const axiosInstance = axios.create({
    baseURL: "https://easydev.club/api/v1",
});

export const fetchTodos = async (filter: FilterStatus): Promise<MetaResponse<Todo, TodoInfo>> => {
    const response = await axiosInstance.get<MetaResponse<Todo, TodoInfo>>("/todos", {
        params: { filter },
    });
    return response.data;
};

export const createTodo = async (todo: TodoRequest): Promise<Todo> => {
    const response = await axiosInstance.post<Todo>("/todos", todo);
    return response.data;
};

export const updateTodo = async (id: number, updated: TodoRequest): Promise<Todo> => {
    const response = await axiosInstance.put<Todo>(`/todos/${id}`, updated);
    return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/todos/${id}`);
};
