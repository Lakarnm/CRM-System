import { Dropdown, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
        } finally {
            navigate("/login", { replace: true });
        }
    };

    const items: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Профиль',
            onClick: () => navigate('/profile')
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Выйти',
            onClick: handleLogout
        },
    ];

    return (
        <div className="sider-footer">
            <Dropdown menu={{ items }} placement="topRight" trigger={['click']}>
                <Button
                    icon={<UserOutlined />}
                    block
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        height: '40px',
                        padding: '0 16px'
                    }}
                >
                    <span style={{ marginLeft: 8 }}>Профиль</span>
                </Button>
            </Dropdown>
        </div>
    );
}