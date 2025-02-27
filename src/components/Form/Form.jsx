import './Form.css'
import {useState} from "react";

const Form = (props) => {
    const [value, setValue] = useState('');

    return (
        <form className="form" onSubmit={e => {
            e.preventDefault();
            props.putTodo(value);
            setValue("");
        }}>
            <input type="text" placeholder="Task To Be Done..." className="todo-input" value={value} onChange={(e) => setValue(e.target.value)} />
            <button className="add" type="submit">Add</button>
        </form>
    )
}

export default Form