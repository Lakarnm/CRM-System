import { Menu } from "antd";
import { CheckSquareOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

export default function AppMenu() {
    const location = useLocation();

    const items = [
        {
            key: "/",
            icon: <CheckSquareOutlined />,
            label: <Link to="/">Задачи</Link>
        },
    ];

    const selectedKey = location.pathname === "/" ? "/" : location.pathname;

    return (
        <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={items}
            style={{ borderRight: "none" }}
        />
    );
}