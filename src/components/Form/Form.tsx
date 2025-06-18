import styles from './Form.module.scss';
import { useState, FormEvent, ChangeEvent } from "react";
import { addTodo } from "../../api/api";

let minTextLength: number = 2;
let maxTextLength: number = 64;

interface FormProps {
    reloadTodos: () => void;
}

function Form({ reloadTodos }: FormProps) {
    const [value, setValue] = useState<string>('');


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!value.trim()) {
            alert("Fill out the form");
            return;
        }

        if (value.length < minTextLength || value.length > maxTextLength) {
            alert("The message must be between 2 and 64 characters long");
            return;
        }

        try {
            await addTodo({ title: value, isDone: false });
            setValue("");
            reloadTodos();
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Task To Be Done..."
                className={styles['todo-input']}
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
            />
            <button className={styles.add} type="submit">Add</button>
        </form>
    );
}

export default Form;
