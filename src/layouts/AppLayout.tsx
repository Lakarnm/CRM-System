import { Layout, Menu, Button } from "antd";
import { CheckSquareOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../features/auth/authSlice";

const { Sider, Content } = Layout;

export default function AppLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const items = [
        { key: "/", icon: <CheckSquareOutlined />, label: <Link to="/">Задачи</Link> },
        { key: "/profile", icon: <UserOutlined />, label: <Link to="/profile">Профиль</Link> },
    ];

    const selectedKey = location.pathname === "/" ? "/" : location.pathname;

    const onLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
        } finally {
            navigate("/login", { replace: true });
        }
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider width={220} theme="light" style={{ borderRight: "1px solid #f0f0f0" }}>
                <div className="sider-brand">CRM System</div>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={items}
                    style={{ borderRight: "none" }}
                />
                <div className="sider-footer">
                    <Button icon={<LogoutOutlined />} block onClick={onLogout}>
                        Выйти
                    </Button>
                </div>
            </Sider>

            <Content style={{ padding: 24 }}>
                <div className="page">
                    <div className="content-card">
                        <Outlet />
                    </div>
                </div>
            </Content>
        </Layout>
    );
}
