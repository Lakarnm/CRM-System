import { memo, useMemo } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { TodoInfo, FilterStatus } from "../../types/types";

interface Props {
    selectedTab: FilterStatus;
    onSelectTab: (tab: FilterStatus) => void;
    todoInfo: TodoInfo;
}

const isFilterStatus = (key: string): key is FilterStatus => {
    return key === "all" || key === "inWork" || key === "completed";
};

const TodoTabs = ({ selectedTab, onSelectTab, todoInfo }: Props) => {
    const items: TabsProps["items"] = useMemo(
        () => [
            { key: "all", label: `Все (${todoInfo.all})` },
            { key: "inWork", label: `В работе (${todoInfo.inWork})` },
            { key: "completed", label: `Завершённые (${todoInfo.completed})` },
        ],
        [todoInfo]
    );

    const handleTabChange = (key: string) => {
        if (isFilterStatus(key)) {
            onSelectTab(key);
    } else {
        console.warn(`Invalid tab key: ${key}`);
    }
    };

    return (
        <Tabs
            className="todo-tabs"
            activeKey={selectedTab}
            onChange={handleTabChange}
            items={items}
            centered
            animated
        />
    );
};

export default memo(TodoTabs);