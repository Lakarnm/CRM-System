import { useCallback, useEffect, useState } from "react";
import { Typography, Space } from "antd";
import { fetchTodos } from "../api/api";
import { Todo, TodoInfo, FilterStatus } from "../types/types";
import TodoTabs from "../components/Tabs/Tabs";
import TodoForm from "../components/Form/Form";
import TodoList from "../components/TodoList/TodoList";

const { Title } = Typography;

const TodoListPage = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [todoInfo, setTodoInfo] = useState<TodoInfo>({
        all: 0,
        completed: 0,
        inWork: 0,
    });
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
    const [isEditing, setIsEditing] = useState(false);

    const loadTodos = useCallback(
        async (status: FilterStatus) => {
            try {
                const response = await fetchTodos(status);
                setTodos(response.data);
                if (response.info) {
                    setTodoInfo(response.info);
                }
            } catch (error) {
                console.error("Ошибка при загрузке задач:", error);
            }
        },
        []
    );

    useEffect(() => {
        if (!isEditing) {
            loadTodos(filterStatus);
        }
    }, [filterStatus, loadTodos, isEditing]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isEditing) {
                loadTodos(filterStatus);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [filterStatus, loadTodos, isEditing]);

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={2} style={{ textAlign: "center" }}>Список задач</Title>
            <TodoForm onAdd={() => loadTodos(filterStatus)} />
            <TodoTabs
                selectedTab={filterStatus}
                onSelectTab={(tab) => setFilterStatus(tab)}
                todoInfo={todoInfo}
            />
            <TodoList
                todos={todos}
                onUpdate={() => loadTodos(filterStatus)}
                setIsEditing={setIsEditing}
            />
        </Space>
    );
};

export default TodoListPage;

