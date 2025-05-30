import './Tabs.css';
import { TodoInfo } from "../../types/types"

interface TabsProps {
    filterStatus: string;
    setFilterStatus: (status: string) => void;
    info: TodoInfo;
}

function Tabs({ filterStatus, setFilterStatus, info }: TabsProps) {
    return (
        <div className="info">
            <button
                className={`stats all ${filterStatus === "all" ? "active" : ""}`}
                onClick={() => setFilterStatus("all")}
            >
                Все: ({info.all})
            </button>
            <button
                className={`stats uncompleted ${filterStatus === "inWork" ? "active" : ""}`}
                onClick={() => setFilterStatus("inWork")}
            >
                В работе: ({info.inWork})
            </button>
            <button
                className={`stats completed ${filterStatus === "completed" ? "active" : ""}`}
                onClick={() => setFilterStatus("completed")}
            >
                Сделано: ({info.completed})
            </button>
        </div>
    );
}

export default Tabs;


