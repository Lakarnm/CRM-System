import { Form, Input, Button, App as AntdApp, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { login } from "../features/auth/authSlice";

const { Title } = Typography;

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { message } = AntdApp.useApp();

    const onFinish = async (values: { login: string; password: string }) => {
        try {
            await dispatch(login({
                login: values.login.trim(),
                password: values.password.trim()
            })).unwrap();
            message.success("Добро пожаловать!");
            navigate("/");
        } catch (error: unknown) {
            const text = typeof error === "string" ? error : "Неверные логин или пароль";
            message.error(text);
        }
    };

    return (
        <>
            <Title level={3} style={{ marginBottom: 16, textAlign: 'center' }}>
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
        </>
    );
}
