import styles from './TodoListPage.module.scss';
import { useState, useEffect } from 'react';
import Form from "../components/Form/Form";
import Tabs from "../components/Tabs/Tabs";
import TodoList from "../components/TodoList/TodoList";
import { fetchTodos } from "../api/api";
import { Todo, TodoInfo, FilterStatus } from "../types/types";

function TodoListPage() {
    const [allTodos, setAllTodos] = useState<Todo[]>([]);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
    const [info, setInfo] = useState<TodoInfo>({ all: 0, completed: 0, inWork: 0 });

    useEffect(() => {
        void loadTodos();
    }, [filterStatus]);

    const loadTodos = async () => {
        try {
            const { data = [], info = { all: 0, completed: 0, inWork: 0 } } = await fetchTodos(filterStatus);
            setAllTodos(data);
            setInfo(info);
        } catch (error) {
            console.error("Loading todos error:", error);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h1 className={styles.title}>Todo list</h1>
                <Form reloadTodos={loadTodos}/>
                <Tabs filterStatus={filterStatus} setFilterStatus={setFilterStatus} info={info}/>
                <TodoList todos={allTodos} onUpdate={loadTodos}/>
            </div>
        </div>
    );
}

export default TodoListPage;

