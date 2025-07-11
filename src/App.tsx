// import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import TodoListPage from "./pages/TodoListPage";
import ProfilePage from "./pages/ProfilePage";

const { Header, Content, Sider } = Layout;

const AppLayout = () => {
    const location = useLocation();

    const menuItems = [
        {
            key: "/",
            icon: <UnorderedListOutlined />,
            label: <Link to="/">Список задач</Link>,
        },
        {
            key: "/profile",
            icon: <UserOutlined />,
            label: <Link to="/profile">Профиль</Link>,
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Header style={{ background: "#fff", padding: 0 }} />
                <Content style={{ margin: "16px" }}>
                    <Routes>
                        <Route path="/" element={<TodoListPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};

const App = () => (
    <Router>
        <AppLayout />
    </Router>
);

export default App;


