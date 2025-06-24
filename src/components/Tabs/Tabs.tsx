import styles from './Tabs.module.scss';
import {FilterStatus, TodoInfo} from "../../types/types"

interface TabsProps {
    filterStatus: FilterStatus;
    setFilterStatus: (status: FilterStatus) => void;
    info: TodoInfo;
}

function Tabs({ filterStatus, setFilterStatus, info }: TabsProps) {
    return (
        <div className={styles.info}>
            <button
                className={`${styles.stats} ${filterStatus === "all" ? styles.active : ""}`}
                onClick={() => setFilterStatus("all")}
            >
                Все: ({info.all})
            </button>
            <button
                className={`${styles.stats} ${filterStatus === "inWork" ? styles.active : ""}`}
                onClick={() => setFilterStatus("inWork")}
            >
                В работе: ({info.inWork})
            </button>
            <button
                className={`${styles.stats} ${filterStatus === "completed" ? styles.active : ""}`}
                onClick={() => setFilterStatus("completed")}
            >
                Сделано: ({info.completed})
            </button>
        </div>
    );
}

export default Tabs;


