import { Typography } from "antd";

const { Title } = Typography;

const ProfilePage = () => {
    return (
        <div style={{ padding: 24 }}>
            <Title level={2} style={{ textAlign: "center" }}>
                Профиль
            </Title>
            <p>Привет!</p>
        </div>
    );
};

export default ProfilePage;
