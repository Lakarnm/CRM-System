import { useEffect, useRef } from "react";
import { Card, Descriptions, Typography, App as AntdApp } from "antd";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProfileThunk } from "../features/auth/authSlice";

const { Title } = Typography;

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const { message } = AntdApp.useApp();
    const loadedRef = useRef(false);
    const profile = useAppSelector((s) => s.auth.profile);
    const isAuthorization = useAppSelector((s) => s.auth.isAuthorization);

    useEffect(() => {
        if (!loadedRef.current && isAuthorization && !profile) {
            loadedRef.current = true;
            dispatch(fetchProfileThunk()).catch(() => {
                message.error("Не удалось загрузить профиль");
            });
        }
    }, [dispatch, isAuthorization, profile, message]);

    if (!profile) {
        return (
            <div className="page">
                <Card className="content-card">Загрузка…</Card>
            </div>
        );
    }

    return (
        <div className="page">
            <Card className="content-card">
                <Title level={3} style={{ marginBottom: 16 }}>
                    Профиль
                </Title>
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Логин">{profile.username || "—"}</Descriptions.Item>
                    <Descriptions.Item label="Почта">{profile.email || "—"}</Descriptions.Item>
                    <Descriptions.Item label="Телефон">{profile.phoneNumber || "—"}</Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
}