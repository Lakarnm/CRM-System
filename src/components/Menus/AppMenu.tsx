import { Menu } from "antd";
import { CheckSquareOutlined, TeamOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectHasAdminOrModeratorRole } from "../../features/auth/authSlice";

export default function AppMenu() {
    const location = useLocation();
    const hasAdminAccess = useAppSelector(selectHasAdminOrModeratorRole);

    const menuItems = [
        {
            key: "/",
            icon: <CheckSquareOutlined />,
            label: <Link to="/">Задачи</Link>
        }
    ];

    if (hasAdminAccess) {
        menuItems.push({
            key: "/users",
            icon: <TeamOutlined />,
            label: <Link to="/users">Пользователи</Link>
        });
    }

    const selectedKey = menuItems.find(item =>
        location.pathname === item.key || location.pathname.startsWith(item.key + '/')
    )?.key || '/';

    return (
        <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            style={{ borderRight: "none" }}
        />
    );
}