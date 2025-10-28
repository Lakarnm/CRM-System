import { Menu } from "antd";
import { CheckSquareOutlined, TeamOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

export default function AppMenu() {
    const location = useLocation();
    const { profile, isAuthorization } = useAppSelector((state) => state.auth);

    const userRoles = profile.data?.roles || [];
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('MODERATOR');
    const showUsersTab = isAuthorization && isAdmin;

    const menuItems = showUsersTab
        ? [
            {
                key: "/",
                icon: <CheckSquareOutlined />,
                label: <Link to="/">Задачи</Link>
            },
            {
                key: "/users",
                icon: <TeamOutlined />,
                label: <Link to="/users">Пользователи</Link>
            },
        ]
        : [
            {
                key: "/",
                icon: <CheckSquareOutlined />,
                label: <Link to="/">Задачи</Link>
            }
        ];

    const selectedKey = location.pathname === "/" ? "/" : location.pathname;

    return (
        <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            style={{ borderRight: "none" }}
        />
    );
}