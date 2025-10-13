import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppMenu from "../components/Menus/AppMenu";
import UserMenu from "../components/Menus/UserMenu";

const { Sider, Content } = Layout;

export default function AppLayout() {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider width={220} theme="light" style={{ borderRight: "1px solid #f0f0f0" }}>
                <div className="sider-brand">CRM System</div>
                <AppMenu />
                <UserMenu />
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