import styles from './TodoList.module.scss';
import TodoItem from "../TodoItem/TodoItem";
import { Todo } from "../../types/types";

interface TodoListProps {
    todos: Todo[];
    onUpdate: () => void;
}

function TodoList({ todos, onUpdate }: TodoListProps) {
    return (
        <ul className={styles.todos}>
            {todos.map(todo => (
                <TodoItem key={todo.id} todo={todo} onUpdate={onUpdate}/>
            ))}
        </ul>
    );
}

export default TodoList;