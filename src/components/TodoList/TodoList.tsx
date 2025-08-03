import TodoItem from "../TodoItem/TodoItem";
import { Todo } from "../../types/types";

interface Props {
    todos: Todo[];
    onUpdate: () => void;
    setIsEditing: (isEditing: boolean) => void;
}

export default function TodoList({ todos, onUpdate, setIsEditing }: Props) {
    return (
        <div>
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={onUpdate}
                    setIsEditing={setIsEditing}
                />
            ))}
        </div>
    );
}
