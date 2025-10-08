import { useEffect, useState, useCallback } from "react";
import { Button, Form, Input, App as AntdApp } from "antd";
import TodoList from "../components/TodoList/TodoList";
import TodoTabs from "../components/Tabs/TodoTabs.js";
import { fetchTodos, createTodo } from "../api/todosApi";
import { Todo, FilterStatus, TodoInfo, TodoRequest } from "../types/types";

export default function TodoListPage() {
    const { message } = AntdApp.useApp();

    const [todos, setTodos] = useState<Todo[]>([]);
    const [todoInfo, setTodoInfo] = useState<TodoInfo>({ all: 0, inWork: 0, completed: 0 });
    const [filter, setFilter] = useState<FilterStatus>("all");
    const [loading, setLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [form] = Form.useForm();

    const loadTodos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchTodos(filter);

            setTodos(response.data);
            setTodoInfo(response.info || {
                all: response.data.length,
                inWork: response.data.filter(todo => !todo.isDone).length,
                completed: response.data.filter(todo => todo.isDone).length,
            });

        } catch (error) {
            message.error("Не удалось загрузить задачи");
        } finally {
            setLoading(false);
        }
    }, [filter, message]);

    useEffect(() => {
        loadTodos();

        const intervalId = setInterval(() => {
            if (!isEditing) loadTodos();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [filter, isEditing, loadTodos]);

    const handleSelectTab = (key: FilterStatus) => {
        setFilter(key);
    };

    const handleAddTodo = async (values: { title: string }) => {
        const payload: TodoRequest = { title: values.title.trim() };
        if (!payload.title) {
            message.warning("Введите задачу");
            return;
        }
        try {
            await createTodo(payload);
            message.success("Задача создана");
            form.resetFields();
            await loadTodos();
        } catch (error) {
            message.error("Не удалось создать задачу");
        }
    };

    return (
        <div className="page">
            <div className="content-card">
                <h1 className="page-title">Список задач</h1>

                <Form form={form} onFinish={handleAddTodo} layout="inline" className="toolbar-form">
                    <Form.Item
                        name="title"
                        className="toolbar-form__input"
                        rules={[{ required: true, message: "Введите задачу" }]}
                    >
                        <Input size="large" placeholder="Новая задача" />
                    </Form.Item>
                    <Form.Item className="toolbar-form__submit">
                        <Button type="primary" htmlType="submit" size="large" loading={loading}>
                            Добавить
                        </Button>
                    </Form.Item>
                </Form>

                <TodoTabs selectedTab={filter} onSelectTab={handleSelectTab} todoInfo={todoInfo} />

                <TodoList todos={todos} onUpdate={loadTodos} setIsEditing={setIsEditing} />
            </div>
        </div>
    );
}