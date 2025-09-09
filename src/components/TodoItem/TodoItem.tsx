import { useState } from "react";
import { Checkbox, Button, Input, Space, Popconfirm, message } from "antd";
import { Todo, TodoRequest } from "../../types/types";
import { updateTodo, deleteTodo } from "../../api/api";

type Props = {
    todo: Todo;
    onUpdate: () => Promise<void>;
    setIsEditing: (v: boolean) => void;
};

export default function TodoItem({ todo, onUpdate, setIsEditing }: Props) {
    const [title, setTitle] = useState(todo.title);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    const toggleDone = async () => {
        try {
            setSaving(true);
            const patch: TodoRequest = { isDone: !todo.isDone };
            await updateTodo(todo.id, patch);
            await onUpdate();
        } catch (e) {
            console.error(e);
            message.error("Не удалось изменить статус задачи");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setSaving(true);
            await deleteTodo(todo.id);
            await onUpdate();
            message.success("Задача удалена");
        } catch (e) {
            console.error(e);
            message.error("Не удалось удалить задачу");
        } finally {
            setSaving(false);
        }
    };

    const startEdit = () => {
        setEditing(true);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setEditing(false);
        setIsEditing(false);
        setTitle(todo.title);
    };

    const saveEdit = async () => {
        const t = title.trim();
        if (!t) return message.warning("Введите название");
        try {
            setSaving(true);
            const patch: TodoRequest = { title: t };
            await updateTodo(todo.id, patch);
            setEditing(false);
            setIsEditing(false);
            await onUpdate();
            message.success("Изменения сохранены");
        } catch (e) {
            console.error(e);
            message.error("Не удалось сохранить изменения");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
            <Checkbox checked={todo.isDone} onChange={toggleDone} disabled={saving} />
            {editing ? (
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onPressEnter={saveEdit}
                    style={{ maxWidth: 420 }}
                />
            ) : (
                <span style={{ textDecoration: todo.isDone ? "line-through" : "none" }}>
          {todo.title}
        </span>
            )}

            <Space style={{ marginLeft: "auto" }}>
                {editing ? (
                    <>
                        <Button size="small" onClick={cancelEdit} disabled={saving}>
                            Отменить
                        </Button>
                        <Button size="small" type="primary" onClick={saveEdit} loading={saving}>
                            Сохранить
                        </Button>
                    </>
                ) : (
                    <>
                        <Button size="small" onClick={startEdit} disabled={saving}>
                            Редактировать
                        </Button>
                        <Popconfirm title="Удалить задачу?" onConfirm={handleDelete} okText="Да" cancelText="Нет">
                            <Button size="small" danger loading={saving}>
                                Удалить
                            </Button>
                        </Popconfirm>
                    </>
                )}
            </Space>
        </div>
    );
}