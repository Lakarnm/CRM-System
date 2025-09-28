import { useState } from "react";
import { Button, Form, Input, Typography } from "antd";
import { useAppDispatch } from "../store/hooks";
import { register } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import type { UserRegistration } from "../types/types";
import { App as AntdApp } from "antd";

const { Text } = Typography;

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { message } = AntdApp.useApp();
    const [submitting, setSubmitting] = useState<boolean>(false);

    const onFinish = async (values: {
        username: string;
        login: string;
        password: string;
        confirmPassword: string;
        email: string;
        phoneNumber?: string;
    }) => {
        const payload: UserRegistration = {
            username: values.username.trim(),
            login: values.login.trim(),
            password: values.password,
            email: values.email.trim(),
            phoneNumber: (values.phoneNumber ?? "").trim(),
        };

        try {
            setSubmitting(true);
            await dispatch(register(payload)).unwrap();
            message.success("Регистрация прошла успешно. Перейдите к авторизации.");
            navigate("/login");
        } catch (error) {
            const text =
                typeof error === "string"
                    ? error
                    : (error as { message?: string })?.message || "Ошибка регистрации";
            message.error(text);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="username"
                    label="Имя пользователя"
                    rules={[
                        { required: true, message: "Введите имя пользователя" },
                        { min: 1, max: 60, message: "От 1 до 60 символов" },
                        {
                            pattern: /^[A-Za-zА-Яа-яЁё\s-]+$/,
                            message: "Только буквы русского/латинского алфавита",
                        },
                    ]}
                >
                    <Input placeholder="Иван Иванов" />
                </Form.Item>

                <Form.Item
                    name="login"
                    label="Логин"
                    rules={[
                        { required: true, message: "Введите логин" },
                        { min: 2, max: 60, message: "От 2 до 60 символов" },
                        {
                            pattern: /^[A-Za-z0-9._-]+$/,
                            message: "Только латиница/цифры/._-",
                        },
                    ]}
                >
                    <Input placeholder="ivan_ivanov" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Почтовый адрес"
                    rules={[
                        { required: true, message: "Введите email" },
                        { type: "email", message: "Некорректный email" },
                    ]}
                >
                    <Input placeholder="user@example.com" />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="Телефон (необязательно)"
                    rules={[
                        {
                            pattern: /^\+?\d{10,15}$/,
                            message: "Некорректный номер (пример: +79991234567)",
                        },
                    ]}
                >
                    <Input placeholder="+79991234567" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Пароль"
                    rules={[
                        { required: true, message: "Введите пароль" },
                        { min: 6, max: 60, message: "От 6 до 60 символов" },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Повторите пароль"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                        { required: true, message: "Повторите пароль" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Пароли не совпадают"));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Button type="primary" htmlType="submit" block loading={submitting}>
                    Зарегистрироваться
                </Button>

                <div style={{ marginTop: 12, textAlign: "center" }}>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </div>
            </Form>
        </>
    );
}