const API_URL = "https://easydev.club/api/v1/todos";

async function fetchTodos(filter = "all") {
    const response = await fetch(`${API_URL}?filter=${filter}`);
    if (!response.ok) {
        throw new Error("Failed to fetch todos");
    }
    const data = await response.json();
    return { todos: data.data, info: data.info };
}

async function addTodo(title) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, isDone: false }),
    });
    if (!response.ok) {
        throw new Error("Failed to add todo");
    }
    // return response.json();
}

async function updateTodo(id, title, isDone) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, isDone }),
    });
    if (!response.ok) {
        throw new Error("Failed to update todo");
    }
    // return response.json();
}

async function deleteTodo(id) {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (response.status === 404) {
        throw new Error("Todo not found");
    }
}

async function getTodoById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch todo");
    }
    return response.json();
}


export { addTodo, getTodoById, updateTodo, deleteTodo, fetchTodos };



