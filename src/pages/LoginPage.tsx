import { Form, Input, Button, App as AntdApp } from "antd";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login } from "../features/auth/authSlice";
import { Link, Navigate } from "react-router-dom";

export default function LoginPage() {
    const { message } = AntdApp.useApp();
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector(s => s.auth.isAuth);
    const loading = useAppSelector(s => s.auth.loading);

    const onFinish = async (values: { login: string; password: string }) => {
        const res = await dispatch(login(values));
        if ((res as any).meta.requestStatus === "fulfilled") {
            message.success("Добро пожаловать!");
        }
    };

    if (isAuth) return <Navigate to="/" replace />;

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-left">
                    <img className="auth-image" src="/img/png/authPicture.png" alt="auth" />
                    <div className="auth-caption">
                        <h3>Turn your ideas into reality.</h3>
                        <div>Start for free and get attractive offers from the community</div>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form">
                        <h2 style={{ marginBottom: 16 }}>Login to your Account</h2>
                        <Form layout="vertical" onFinish={onFinish}>
                            <Form.Item label="Login" name="login" rules={[{ required: true, message: "Введите логин" }]}>
                                <Input placeholder="your login" />
                            </Form.Item>
                            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Введите пароль" }]}>
                                <Input.Password placeholder="••••••••" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} block>
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>

                        <div style={{ marginTop: 8, textAlign: "center", fontSize: 14 }}>
                            Не зарегистрированы?{" "}
                            <Link to="/register">Создать аккаунт</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}