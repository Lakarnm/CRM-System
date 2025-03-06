import './Form.css';
import { useState } from "react";
import { addTodo } from "../../api/api.js";

const Form = ({ onTaskAdded }) => {
    const [value, setValue] = useState('');

    const handleSubmit = async (e) => {
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
            onTaskAdded();
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
                onChange={(e) => setValue(e.target.value)}
            />
            <button className="add" type="submit">Add</button>
        </form>
    );
};

export default Form;
