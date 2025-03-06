import { useState, useEffect } from 'react';
import './App.css';
import Form from "./components/Form/Form.jsx";
import Tabs from "./components/Tabs/Tabs.jsx";
import TodoItem from "./components/TodoItem/TodoItem.jsx";
import { fetchTodos } from "./api/api.js";

function App() {
    const [allTodos, setAllTodos] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [counters, setCounters] = useState({total: 0, completed: 0, uncompleted: 0});

    useEffect(() => {
        loadTodos();
    }, [filterStatus]);

    const loadTodos = async () => {
        try {
            const { todos = [], info = { all: 0, completed: 0, inWork: 0 } } = await fetchTodos(filterStatus);

            const filteredTodos = filterStatus === "uncompleted"
                ? todos.filter(todo => !todo.isDone)
                : todos;

            setAllTodos(filteredTodos);
            setCounters({
                total: info.all ?? 0,
                completed: info.completed ?? 0,
                uncompleted: info.inWork ?? 0,
            });
        } catch (error) {
            console.error("Loading todos error:", error);
        }
    };

    return (
        <div className="wrapper">
            <div className="container">
                <h1 className="title">Todo list</h1>

                <Form onTaskAdded={loadTodos} />

                <Tabs filterStatus={filterStatus} setFilterStatus={setFilterStatus} counters={counters} />

                <ul className="todos">
                    {allTodos.map(todo => (
                        <TodoItem key={todo.id} todo={todo} onUpdate={loadTodos} />
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;

