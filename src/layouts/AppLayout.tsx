import { Layout, Spin } from "antd";
import { Outlet } from "react-router-dom";
import AppMenu from "../components/Menus/AppMenu";
import UserMenu from "../components/Menus/UserMenu";
import { useAppSelector } from "../store/hooks";

const { Sider, Content } = Layout;

export default function AppLayout() {
    const { profile, isReady } = useAppSelector((state) => state.auth);

    if (!isReady) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                width={220}
                theme="light"
                style={{
                    borderRight: "1px solid #f0f0f0",
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                }}
            >
                <div className="sider-brand">CRM System</div>
                <div style={{ flex: 1, overflow: 'auto' }}>
                    <AppMenu />
                </div>
                <div style={{
                    padding: '16px',
                    borderTop: '1px solid #f0f0f0',
                    background: '#fff',
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 1
                }}>
                    <UserMenu />
                </div>
            </Sider>

            <Content style={{
                padding: 0,
                overflow: 'auto'
            }}>
                <Outlet />
            </Content>
        </Layout>
    );
}