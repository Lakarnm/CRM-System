import { useState, useEffect} from 'react'
import './App.css'
import Form from "./components/Form/Form.jsx";
import Checkbox from "./components/Checkbox/Checkbox.jsx";
import { fetchTodos, getTodoById, addTodo, updateTodo, deleteTodo } from "./api/api.js";

function App() {
    const [allTodos, setAllTodos] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [editingTodo, setEditingTodo] = useState(null);
    const [editingText, setEditingText] = useState("");

    const totalCount = allTodos.length;
    const completedCount = allTodos.filter(todo => todo.isDone).length;
    const uncompletedCount = totalCount - completedCount;

    useEffect(() => {
        async function loadAllTodos() {
            try {
                const data = await fetchTodos("all");
                setAllTodos(data.data);
            } catch (error) {
                console.error("Loading todos error:", error);
            }
        }
        loadAllTodos();
    }, []);

    useEffect(() => {
        const filtered = allTodos.filter(todo => {
            if (filterStatus === "uncompleted") return !todo.isDone;
            if (filterStatus === "completed") return todo.isDone;
            return true;
        });
        setFilteredTodos(filtered);
    }, [filterStatus, allTodos]);

    const putTodo = async (value) => {
        if (!value.trim()) {
            alert("Fill out the form");
            return;
        }

        if (value.length < 2 || value.length > 64) {
            alert("The message must be between 2 and 64 characters long");
            return;
        }

        try {
            const newTodo = await addTodo(value);
            setAllTodos(prevTodos => [...prevTodos, newTodo]);
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    const toggleTodo = async (id) => {
        try {
            const todo = allTodos.find(todo => todo.id === id);
            const updatedTodo = await updateTodo(id, todo.title, !todo.isDone);
            setAllTodos(prevTodos =>
                prevTodos.map(todo =>
                    todo.id === id ? updatedTodo : todo
                )
            );
        } catch (error) {
            console.error("Todo update error:", error);
        }
    };

    const removeTodo = async (id) => {
        try {
            await deleteTodo(id);
            setAllTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    const startEditing = (id, text) => {
        setEditingTodo(id);
        setEditingText(text);
    }

    const saveEditing = async (id) => {
        if (!editingText.trim()) {
            alert("The todo's text can't be empty");
            return;
        }
        try {
            const updatedTodo = await updateTodo(id, editingText, allTodos.find(t => t.id === id).isDone);
            setAllTodos(prevTodos => prevTodos.map((todo) => todo.id === id ? updatedTodo : todo));
            setEditingTodo(null);
            setEditingText("");
        } catch (error) {
            console.error("Error editing todo:", error);
        }
    };

    const cancelEditing = () => {
        setEditingTodo(null);
        setEditingText("");
    }

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
                        Все: ({totalCount})
                    </button>
                    <button
                        className={`stats uncompleted ${filterStatus === "uncompleted" ? "active" : ""}`}
                        onClick={() => setFilterStatus("uncompleted")}
                    >
                        В работе: ({uncompletedCount})
                    </button>
                    <button
                        className={`stats completed ${filterStatus === "completed" ? "active" : ""}`}
                        onClick={() => setFilterStatus("completed")}
                    >
                        Сделано: ({completedCount})
                    </button>
                </div>

                <ul className="todos">
                    {filteredTodos.map(todo => (
                        <li className={todo.isDone ? "todo done" : "todo"} key={todo.id}>
                            <Checkbox checked={todo.isDone} onChange={() => toggleTodo(todo.id)}/>

                            {editingTodo === todo.id ?(
                                    <input className="edit-input" type="text" value={editingText || ""} onChange={(e) => setEditingText(e.target.value)}/>
                                ) :

                                (<span className="text-done">{todo.title}</span>)
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
                                        onClick={() => startEditing(todo.id,todo.title)}
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