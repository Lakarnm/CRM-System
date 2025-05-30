import './Tabs.css'

function Tabs({ filterStatus, setFilterStatus, counters }) {
    return (
        <div className="info">
            <button
                className={`stats all ${filterStatus === "all" ? "active" : ""}`}
                onClick={() => setFilterStatus("all")}
            >
                Все: ({counters.total})
            </button>
            <button
                className={`stats uncompleted ${filterStatus === "uncompleted" ? "active" : ""}`}
                onClick={() => setFilterStatus("uncompleted")}
            >
                В работе: ({counters.uncompleted})
            </button>
            <button
                className={`stats completed ${filterStatus === "completed" ? "active" : ""}`}
                onClick={() => setFilterStatus("completed")}
            >
                Сделано: ({counters.completed})
            </button>
        </div>
    );
}

export default Tabs;
