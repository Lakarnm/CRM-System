import { memo, useMemo } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { TodoInfo, FilterStatus } from "../../types/types";

interface Props {
    selectedTab: FilterStatus;
    onSelectTab: (tab: FilterStatus) => void;
    todoInfo: TodoInfo;
}

const TodoTabs = ({ selectedTab, onSelectTab, todoInfo }: Props) => {
    const items: TabsProps["items"] = useMemo(
        () => [
            { key: "all", label: `Все (${todoInfo.all})` },
            { key: "inWork", label: `В работе (${todoInfo.inWork})` },
            { key: "completed", label: `Завершённые (${todoInfo.completed})` },
        ],
        [todoInfo]
    );

    return (
        <Tabs
            className="todo-tabs"
            key={selectedTab}
            activeKey={selectedTab}
            onChange={(key) => onSelectTab(key as FilterStatus)}
            items={items}
            centered
            animated
        />
    );
};

export default memo(TodoTabs);