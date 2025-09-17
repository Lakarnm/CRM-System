import { useState } from "react";
import { Checkbox, Button, Input, Space, Popconfirm, message } from "antd";
import { Todo, TodoRequest } from "../../types/types";
import { updateTodo, deleteTodo } from "../../api/api";

interface Props {
    todo: Todo;
    onUpdate: () => Promise<void>;
    setIsEditing: (isEditing: boolean) => void;
}

export default function TodoItem({ todo, onUpdate, setIsEditing }: Props) {
    const [title, setTitle] = useState<string>(todo.title);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isEditingLocal, setIsEditingLocal] = useState<boolean>(false);

    const toggleDone = async () => {
        try {
            setIsSaving(true);
            const patch: TodoRequest = { isDone: !todo.isDone };
            await updateTodo(todo.id, patch);
            await onUpdate();
        } catch (error) {
            console.error(error);
            message.error("Не удалось изменить статус задачи");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsSaving(true);
            await deleteTodo(todo.id);
            await onUpdate();
            message.success("Задача удалена");
        } catch (error) {
            console.error(error);
            message.error("Не удалось удалить задачу");
        } finally {
            setIsSaving(false);
        }
    };

    const startEdit = () => {
        setIsEditingLocal(true);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setIsEditingLocal(false);
        setIsEditing(false);
        setTitle(todo.title);
    };

    const saveEdit = async () => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            message.warning("Введите название");
            return;
        }
        try {
            setIsSaving(true);
            const patch: TodoRequest = { title: trimmedTitle };
            await updateTodo(todo.id, patch);
            setIsEditingLocal(false);
            setIsEditing(false);
            await onUpdate();
            message.success("Изменения сохранены");
        } catch (error) {
            console.error(error);
            message.error("Не удалось сохранить изменения");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
            <Checkbox checked={todo.isDone} onChange={toggleDone} disabled={isSaving} />
            {isEditingLocal ? (
                <Input
                    value={title}
                    onChange={(evt) => setTitle(evt.target.value)}
                    onPressEnter={saveEdit}
                    style={{ maxWidth: 420 }}
                />
            ) : (
                <span style={{ textDecoration: todo.isDone ? "line-through" : "none" }}>{todo.title}</span>
            )}

            <Space style={{ marginLeft: "auto" }}>
                {isEditingLocal ? (
                    <>
                        <Button size="small" onClick={cancelEdit} disabled={isSaving}>
                            Отменить
                        </Button>
                        <Button size="small" type="primary" onClick={saveEdit} loading={isSaving}>
                            Сохранить
                        </Button>
                    </>
                ) : (
                    <>
                        <Button size="small" onClick={startEdit} disabled={isSaving}>
                            Редактировать
                        </Button>
                        <Popconfirm
                            title="Удалить задачу?"
                            onConfirm={handleDelete}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button size="small" danger loading={isSaving}>
                                Удалить
                            </Button>
                        </Popconfirm>
                    </>
                )}
            </Space>
        </div>
    );
}
