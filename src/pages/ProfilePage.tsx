import { useEffect } from "react";
import { Card, Spin, Typography, Descriptions } from "antd";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProfileThunk } from "../features/auth/authSlice";
import { selectProfileView } from "../features/auth/selectors";

const { Title, Text } = Typography;

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const { data: profile, status: { isIdle, isLoadingOrIdle } } = useAppSelector(selectProfileView);

    useEffect(() => {
        if (isIdle) {
            dispatch(fetchProfileThunk());
        }
    }, [isIdle, dispatch]);

    if (isLoadingOrIdle) {
        return (
            <div style={{ display: "grid", placeItems: "center", minHeight: "50vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={{ padding: 24 }}>
                <Card>Не удалось загрузить профиль.</Card>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="content-card">
                <Title level={1} style={{ marginBottom: 24 }}>
                    Профиль
                </Title>

                <Descriptions
                    bordered
                    column={1}
                    size="middle"
                    labelStyle={{ fontWeight: 600, width: '180px' }}
                >
                    <Descriptions.Item label="Почта">
                        <Text>{profile.email}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Телефон">
                        <Text>{profile.phoneNumber || "—"}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Имя пользователя">
                        <Text>{profile.username}</Text>
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </div>
    );
}