import { useState, memo } from "react";
import { Checkbox, Input, Button, Space, Form, message } from "antd";
import { DeleteOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Todo } from "../../types/types";
import { deleteTodo, updateTodo } from "../../api/api";

interface Props {
    todo: Todo;
    onUpdate: () => void;
    setIsEditing: (isEditing: boolean) => void;
}

const TodoItem = memo(({ todo, onUpdate, setIsEditing }: Props) => {
    const [isEditing, setLocalEditing] = useState<boolean>(false);
    const [form] = Form.useForm();

    const handleToggleDone = async () => {
        try {
            await updateTodo(todo.id, { isDone: !todo.isDone });
            onUpdate();
        } catch (e) {
            console.error(e);
            message.error("Не удалось обновить задачу");
        }
    };


    const handleDelete = async () => {
        await deleteTodo(todo.id);
        onUpdate();
    };

    const handleEdit = () => {
        setIsEditing(true);
        setLocalEditing(true);
        form.setFieldsValue({ title: todo.title });
    };

    const handleFinish = async (values: { title: string }) => {
        const trimmed = values.title.trim();
        if (trimmed !== todo.title) {
            await updateTodo(todo.id, { title: trimmed });
            message.success("Задача обновлена");
        }
        setIsEditing(false);
        setLocalEditing(false);
        onUpdate();
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #eee",
            }}
        >
            <Checkbox checked={todo.isDone} onChange={handleToggleDone} />

            {isEditing ? (
                <Form
                    form={form}
                    initialValues={{ title: todo.title }}
                    onFinish={handleFinish}
                    style={{ flex: 1, marginLeft: 8 }}
                >
                    <Form.Item
                        name="title"
                        rules={[
                            { required: true, message: "Введите задачу" },
                            { min: 2, message: "Минимум 2 символа" },
                            { max: 64, message: "Максимум 64 символа" },
                        ]}
                        style={{ marginBottom: 0 }}
                    >
                        <Input
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>
                </Form>
            ) : (
                <span
                    style={{
                        marginLeft: 8,
                        flex: 1,
                        textDecoration: todo.isDone ? "line-through" : "none",
                        color: todo.isDone ? "#999" : "inherit",
                    }}
                >
                    {todo.title}
                </span>
            )}

            <Space>
                {isEditing ? (
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        htmlType="submit"
                    />
                ) : (
                    <Button icon={<EditOutlined />} onClick={handleEdit} />
                )}
                <Button danger icon={<DeleteOutlined />} onClick={handleDelete} />
            </Space>
        </div>
    );
});

export default TodoItem;





