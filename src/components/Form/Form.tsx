import './Form.css';
import { useState, FormEvent, ChangeEvent } from "react";
import { addTodo } from "../../api/api";

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

        if (value.length < 2 || value.length > 64) {
            alert("The message must be between 2 and 64 characters long");
            return;
        }

        try {
            await addTodo(value);
            setValue("");
            reloadTodos();
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Task To Be Done..."
                className="todo-input"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
            />
            <button className="add" type="submit">Add</button>
        </form>
    );
}

export default Form;
