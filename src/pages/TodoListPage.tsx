import './TodoListPage.css';
import { useState, useEffect } from 'react';
import Form from "../components/Form/Form";
import Tabs from "../components/Tabs/Tabs";
import TodoList from "../components/TodoList/TodoList";
import { fetchTodos } from "../api/api";
import { Todo, TodoInfo } from "../types/types";

function TodoListPage() {
    const [allTodos, setAllTodos] = useState<Todo[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [info, setInfo] = useState<TodoInfo>({ all: 0, completed: 0, inWork: 0 });

    useEffect(() => {
        loadTodos();
    }, [filterStatus]);

    const loadTodos = async () => {
        try {
            const { todos = [], info = { all: 0, completed: 0, inWork: 0 } } = await fetchTodos(filterStatus);
            setAllTodos(todos);
            setInfo(info);
        } catch (error) {
            console.error("Loading todos error:", error);
        }
    };

    return (
        <div className="wrapper">
            <div className="container">
                <h1 className="title">Todo list</h1>
                <Form reloadTodos={loadTodos} />
                <Tabs filterStatus={filterStatus} setFilterStatus={setFilterStatus} info={info} />
                <TodoList todos={allTodos} onUpdate={loadTodos} />
            </div>
        </div>
    );
}

export default TodoListPage;

