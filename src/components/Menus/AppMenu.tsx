import { Menu } from "antd";
import { CheckSquareOutlined, TeamOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { hasRole } from "../../utils/roleUtils";
import { Roles } from "../../types/types";

export default function AppMenu() {
    const location = useLocation();
    const { profile, isAuthorized } = useAppSelector((state) => state.auth);

    // FOR USERS
    const baseMenuItems = [
        {
            key: "/",
            icon: <CheckSquareOutlined />,
            label: <Link to="/">Задачи</Link>
        }
    ];

    // FOR ADMINS AND MODS ONLY
    const adminMenuItems = hasRole(profile.data?.roles, [Roles.ADMIN, Roles.MODERATOR])
        ? [
            {
                key: "/users",
                icon: <TeamOutlined />,
                label: <Link to="/users">Пользователи</Link>
            }
        ]
        : [];

    const menuItems = isAuthorized ? [...baseMenuItems, ...adminMenuItems] : baseMenuItems;

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