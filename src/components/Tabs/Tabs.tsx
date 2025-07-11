import { Tabs } from "antd";
import type { TabsProps as AntdTabsProps } from "antd";
import { TodoInfo, FilterStatus } from "../../types/types";

interface Props {
    selectedTab: FilterStatus;
    onSelectTab: (tab: FilterStatus) => void;
    todoInfo: TodoInfo;
}

const TodoTabs = ({ selectedTab, onSelectTab, todoInfo }: Props) => {
    const items: AntdTabsProps["items"] = [
        {
            key: "all",
            label: `Все (${todoInfo.all})`,
        },
        {
            key: "inWork",
            label: `В работе (${todoInfo.inWork})`,
        },
        {
            key: "completed",
            label: `Завершённые (${todoInfo.completed})`,
        },
    ];

    return (
        <Tabs
            activeKey={selectedTab}
            onChange={(key) => onSelectTab(key as FilterStatus)}
            items={items}
            centered
        />
    );
};

export default TodoTabs;




