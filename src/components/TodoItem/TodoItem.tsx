import { useState, ChangeEvent } from 'react';
import './TodoItem.css';
import Checkbox from "../ui/Checkbox/Checkbox.js";
import { updateTodo, deleteTodo } from "../../api/api";
import { Todo } from "../../types/types"

interface TodoItemProps {
    todo: Todo;
    onUpdate: () => void;
}

function TodoItem ({ todo, onUpdate }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingText, setEditingText] = useState<string>(todo.title);

    const saveEditing = async () => {
        if (!editingText.trim()) {
            alert("The todo's text can't be empty");
            return;
        }

        if (editingText.length < 2 || editingText.length > 64) {
            alert("The message must be between 2 and 64 characters long");
            return;
        }

        try {
            await updateTodo(todo.id, editingText, todo.isDone);
            setIsEditing(false);
            onUpdate();
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    const toggleTodo = async () => {
        try {
            await updateTodo(todo.id, todo.title, !todo.isDone);
            onUpdate();
        } catch (error) {
            console.error("Error toggling todo:", error);
        }
    };

    const removeTodo = async () => {
        try {
            await deleteTodo(todo.id);
            onUpdate();
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    return (
        <li className={todo.isDone ? "todo done" : "todo"}>
            <div className="todo-left">
            <Checkbox checked={todo.isDone} onChange={toggleTodo} />

            {isEditing ? (
                <input
                    className="edit-input"
                    type="text"
                    value={editingText}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingText(e.target.value)}
                />
            ) : (
                <span className="text-done">{todo.title}</span>
            )}
            </div>

            <div className="todo-controls">
            {isEditing ? (
                <>
                    <img
                        className="save-btn-img"
                        src="./img/svg/floppy-disk.svg"
                        alt="save"
                        onClick={saveEditing}
                    />
                    <img
                        className="close-btn-img"
                        src="./img/svg/cancel.svg"
                        alt="close"
                        onClick={() => {
                            setIsEditing(false);
                            setEditingText(todo.title);
                        }}
                    />

                </>
            ) : (
                <img
                    className="edit"
                    src="./img/svg/pen.svg"
                    alt="edit"
                    onClick={() => setIsEditing(true)}
                />
            )}

            <img
                className="delete"
                src="./img/svg/trash.svg"
                alt="delete"
                onClick={(e) => {
                    e.stopPropagation();
                    removeTodo();
                }}
            />
            </div>
        </li>
    )}

export default TodoItem;
