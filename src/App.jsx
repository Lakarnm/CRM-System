import {useState} from 'react'
import './App.css'
import Form from "./components/Form/Form.jsx";
import Checkbox from "./components/Checkbox/Checkbox.jsx";

function App() {
    const [todos, setTodos] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [editingTodo, setEditingTodo] = useState(null);
    const [editingText, setEditingText] = useState("");

    const allTodos = todos.length;
    const allCompleted = todos.filter(todo => todo.done).length;
    const allUncompleted = allTodos - allCompleted;


    const putTodo = (value) => {
        if (!value.trim()) {
            alert("Fill out the form");
            return;
        }

        if (value.length < 2 || value.length > 64) {
            alert("The message must be between 2 and 64 characters long");
            return;
        }

        setTodos(prevTodos => [...prevTodos, { id: Date.now(), text: value, done: false }]);
    };


    const toggleTodo = (id) => {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, done: !todo.done } : todo
            )
        );
    };

    const removeTodo = (id) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    };

    const startEditing = (id, text) => {
        setEditingTodo(id);
        setEditingText(text);
    }

    const saveEditing = (id) => {
        if (!editingText.trim()) {
            alert("The todo text can't be empty");
            return;
        }

        setTodos(prevTodos => prevTodos.map(todo =>
            todo.id === id ? { ...todo,text: editingText} : todo));

        setEditingTodo(null);
        setEditingText("");
    };

    const cancelEditing = () => {
        setEditingTodo(null);
        setEditingText("");
    }

    const filteredTodos = todos.filter(todo => {
        if (filterStatus === "uncompleted") return !todo.done;
        if (filterStatus === "completed") return todo.done;
        return true;
    });

    return (
        <div className="wrapper">
            <div className="container">
                <h1 className="title">Todo list</h1>

                <Form putTodo={putTodo} />

                <div className="info">
                    <button
                        className={`stats all ${filterStatus === "all" ? "active" : ""}`}
                        onClick={() => setFilterStatus("all")}
                    >
                        Все: ({allTodos})
                    </button>
                    <button
                        className={`stats uncompleted ${filterStatus === "uncompleted" ? "active" : ""}`}
                        onClick={() => setFilterStatus("uncompleted")}
                    >
                        В работе: ({allUncompleted})
                    </button>
                    <button
                        className={`stats completed ${filterStatus === "completed" ? "active" : ""}`}
                        onClick={() => setFilterStatus("completed")}
                    >
                        Сделано: ({allCompleted})
                    </button>
                </div>

                <ul className="todos">
                    {filteredTodos.map(todo => (
                        <li className={todo.done ? "todo done" : "todo"} key={todo.id}>
                            <Checkbox checked={todo.done} onChange={() => toggleTodo(todo.id)}/>

                            {editingTodo === todo.id ?(
                                <input className="edit-input" type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)}/>
                            ) :

                                (<span className="text-done">{todo.text}</span>)
                            }

                            {editingTodo === todo.id ? (
                                    <>
                                        <img className="save-btn-img" src="./img/svg/floppy-disk.svg" alt="save" onClick={() => saveEditing(todo.id)}/>

                                        <img className="close-btn-img" src="./img/svg/cancel.svg" alt="close" onClick={cancelEditing}/>
                                    </>)

                                : (

                                <img
                                    className="edit"
                                    src="./img/svg/pen.svg"
                                    alt="edit"
                                    onClick={() => startEditing(todo.id,todo.text)}
                            />)}

                            <img
                                className="delete"
                                src="./img/svg/trash.svg"
                                alt="delete"
                                onClick={e => {
                                    e.stopPropagation();
                                    removeTodo(todo.id);
                                }}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;