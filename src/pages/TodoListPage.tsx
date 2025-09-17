import { useEffect, useState, useCallback, useRef } from "react";
import { Button, Form, Input, App as AntdApp } from "antd";
import TodoList from "../components/TodoList/TodoList";
import TodoTabs from "../components/Tabs/Tabs";
import { fetchTodos, createTodo } from "../api/api";
import { Todo, FilterStatus, TodoInfo, MetaResponse, TodoRequest } from "../types/types";

export default function TodoListPage() {
    const { message } = AntdApp.useApp();

    const [todos, setTodos] = useState<Todo[]>([]);
    const [todoInfo, setTodoInfo] = useState<TodoInfo>({ all: 0, inWork: 0, completed: 0 });
    const [filter, setFilter] = useState<FilterStatus>("all");
    const [loading, setLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [form] = Form.useForm();

    const pollIntervalRef = useRef<number | null>(null);
    const lastRequestIdRef = useRef(0);
    const didInitRef = useRef(false);

    const loadTodos = useCallback(async () => {
        const requestId = ++lastRequestIdRef.current;
        try {
            setLoading(true);
            const response: MetaResponse<Todo, TodoInfo> = await fetchTodos(filter);

            if (requestId !== lastRequestIdRef.current) return;

            const normalizedList =
                filter === "all"
                    ? response.data
                    : filter === "inWork"
                        ? response.data.filter((todoItem) => !todoItem.isDone)
                        : response.data.filter((todoItem) => todoItem.isDone);

            setTodos(normalizedList);
            setTodoInfo(
                response.info ?? {
                    all: response.data.length,
                    inWork: response.data.filter((todoItem) => !todoItem.isDone).length,
                    completed: response.data.filter((todoItem) => todoItem.isDone).length,
                }
            );
        } catch (error) {
            console.error(error);
            message.error("Не удалось загрузить задачи");
        } finally {
            setLoading(false);
        }
    }, [filter, message]);

    useEffect(() => {

        if (!didInitRef.current) {
            didInitRef.current = true;
            void loadTodos();
        } else {
            void loadTodos();
        }

        if (pollIntervalRef.current) {
            window.clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }

        if (!isEditing) {
            pollIntervalRef.current = window.setInterval(() => {
                void loadTodos();
            }, 5000);
        }

        return () => {
            if (pollIntervalRef.current) {
                window.clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
        };
    }, [loadTodos, isEditing]);

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
            console.error(error);
            message.error("Не удалось создать задачу");
        }
    };

    const handleSelectTab = (key: string) => {
        setFilter(key as FilterStatus);
    };

    return (
        <div className="page">
            <div className="content-card">
                <h1 className="page-title">Список задач</h1>

                <Form form={form} onFinish={handleAddTodo} layout="inline" className="toolbar-form">
                    <Form.Item
                        name="title"
                        className="toolbar-form__input"
                        rules={[
                            { required: true, message: "Введите задачу" },
                            { min: 2, message: "Минимум 2 символа" },
                            { max: 64, message: "Максимум 64 символа" },
                        ]}
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