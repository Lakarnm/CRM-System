import { useState, ChangeEvent, MouseEvent } from "react";
import styles from "./TodoItem.module.scss";
import Checkbox from "../../ui/Checkbox/Checkbox.js";
import { updateTodo, deleteTodo } from "../../api/api";
import { Todo } from "../../types/types";

const MIN_TEXT_LENGTH = 2;
const MAX_TEXT_LENGTH = 64;

interface TodoItemProps {
    todo: Todo;
    onUpdate: () => void;
}

function TodoItem({ todo, onUpdate }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingText, setEditingText] = useState<string>(todo.title);

    const handleToggle = async () => {
        try {
            await updateTodo(todo.id, { title: todo.title, isDone: !todo.isDone });
            onUpdate();
        } catch (error) {
            console.error("Error toggling todo:", error);
        }
    };

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEditingText(e.target.value);
    };

    const handleSaveClick = async () => {
        const trimmedText = editingText.trim();

        if (!trimmedText) {
            alert("The todo's text can't be empty");
            return;
        }

        if (trimmedText.length < MIN_TEXT_LENGTH || trimmedText.length > MAX_TEXT_LENGTH) {
            alert("The message must be between 2 and 64 characters long");
            return;
        }

        try {
            await updateTodo(todo.id, { title: trimmedText, isDone: todo.isDone });
            setIsEditing(false);
            onUpdate();
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditingText(todo.title);
    };

    const handleDeleteClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        try {
            await deleteTodo(todo.id);
            onUpdate();
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    return (
        <li className={`${styles.todo} ${todo.isDone ? styles.done : ""}`}>
            <div className={styles['todo-left']}>
                <Checkbox checked={todo.isDone} onChange={handleToggle}/>
                {isEditing ? (
                    <input
                        className={styles['edit-input']}
                        type="text"
                        value={editingText}
                        onChange={handleTitleChange}
                    />
                ) : (
                    <span className={styles['text-done']}>{todo.title}</span>
                )}
            </div>

            <div className={styles['todo-controls']}>
                {isEditing ? (
                    <>
                        <button className={`${styles['icon-button']} ${styles['save-btn']}`} onClick={handleSaveClick}>
                            <img src="./img/svg/floppy-disk.svg" alt=""/>
                        </button>
                        <button className={`${styles['icon-button']} ${styles['cancel-btn']}`}
                                onClick={handleCancelClick}>
                            <img src="./img/svg/cancel.svg" alt=""/>
                        </button>
                    </>
                ) : (
                    <button className={`${styles['icon-button']} ${styles['edit-btn']}`} onClick={handleEditClick}>
                        <img src="./img/svg/pen.svg" alt=""/>
                    </button>
                )}
                <button className={`${styles['icon-button']} ${styles['delete-btn']}`} onClick={handleDeleteClick}>
                    <img src="./img/svg/trash.svg" alt=""/>
                </button>
            </div>
        </li>
    );
}

export default TodoItem;
