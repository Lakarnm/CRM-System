import { Card, Form, Input, Button, Typography, App as AntdApp } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { login } from "../features/auth/authSlice";

const { Title, Text } = Typography;

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { message } = AntdApp.useApp();

    const onFinish = async (v: { login: string; password: string }) => {
        try {
            await dispatch(login({ login: v.login.trim(), password: v.password })).unwrap();
            message.success("Добро пожаловать!");
            navigate("/");
        } catch (e: any) {
            message.error(typeof e === "string" ? e : "Неверные логин или пароль");
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-left">
                    <img className="auth-image" src="/img/png/authPicture.png" alt="Auth" />
                    <div className="auth-caption">
                        <Text type="secondary">Войдите, чтобы управлять задачами</Text>
                    </div>
                </div>

                <div className="auth-right">
                    <Card className="auth-form">
                        <Title level={3} style={{ marginBottom: 16 }}>
                            Авторизация
                        </Title>

                        <Form layout="vertical" onFinish={onFinish}>
                            <Form.Item
                                name="login"
                                label="Логин"
                                rules={[
                                    { required: true, message: "Введите логин" },
                                    { min: 2, max: 60, message: "От 2 до 60 символов" },
                                ]}
                            >
                                <Input placeholder="ivan_ivanov" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Пароль"
                                rules={[{ required: true, message: "Введите пароль" }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Button type="primary" htmlType="submit" block>
                                Войти
                            </Button>

                            <div style={{ marginTop: 12, textAlign: "center" }}>
                                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                            </div>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    );
}