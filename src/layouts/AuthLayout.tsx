import { Card, Typography } from "antd";
import { Outlet } from "react-router-dom";
import { ReactNode } from "react";

const { Text, Title } = Typography;

interface AuthLayoutProps {
    title?: string;
    caption?: ReactNode;
}

export default function AuthLayout({ title, caption }: AuthLayoutProps) {
    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-left">
                    <img className="auth-image" src="/img/png/authPicture.png" alt="Auth" />
                    <div className="auth-caption">
                        <Text type="secondary">
                            {caption || "Войдите, чтобы управлять задачами"}
                        </Text>
                    </div>
                </div>

                <div className="auth-right">
                    <Card className="auth-form">
                        {title && (
                            <Title level={3} style={{ marginBottom: 16 }}>
                                {title}
                            </Title>
                        )}
                        <Outlet />
                    </Card>
                </div>
            </div>
        </div>
    );
}