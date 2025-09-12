import React from "react";
import { Button, Card, Form, Input, Typography, App as AntdApp } from "antd";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { register } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import type { UserRegistration } from "../types/types";

const { Title } = Typography;

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { message } = AntdApp.useApp();
    const { loading } = useAppSelector((s) => s.auth);

    const onFinish = async (v: {
        username: string;
        login: string;
        password: string;
        confirmPassword: string;
        email: string;
        phoneNumber?: string;
    }) => {
        if (v.password !== v.confirmPassword) {
            message.error("Пароли не совпадают");
            return;
        }

        const phone = (v.phoneNumber ?? "").trim();

        const payload: UserRegistration = {
            username: v.username.trim(),
            login: v.login.trim(),
            password: v.password,
            email: v.email.trim(),
            ...(phone ? { phoneNumber: phone } : {}),
        };

        try {
            await dispatch(register(payload)).unwrap();
            message.success({
                content: (
                    <div>
                        Регистрация прошла успешно.{" "}
                        <a onClick={() => navigate("/login")}>Перейти к авторизации</a>
                    </div>
                ),
                duration: 5,
            });
        } catch (e: any) {
            message.error(typeof e === "string" ? e : e?.message || "Ошибка регистрации");
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", padding: "48px" }}>
            <Card style={{ width: 420 }}>
                <Title level={3} style={{ marginBottom: 16 }}>
                    Регистрация
                </Title>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="username"
                        label="Имя пользователя"
                        rules={[
                            { required: true, message: "Введите имя пользователя" },
                            { min: 1, max: 60, message: "От 1 до 60 символов" },
                            { pattern: /^[A-Za-zА-Яа-яЁё\s-]+$/, message: "Только буквы русского/латинского алфавита" },
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
                            { pattern: /^[A-Za-z0-9._-]+$/, message: "Только латиница/цифры/._-" },
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
                        label="Телефон"
                        rules={[
                            {
                                validator: (_, value?: string) => {
                                    const val = (value ?? "").trim();
                                    if (!val) return Promise.resolve();
                                    const ok = /^\+?\d{10,15}$/.test(val.replace(/\s+/g, ""));
                                    return ok
                                        ? Promise.resolve()
                                        : Promise.reject(new Error("Некорректный номер (пример: +79991234567)"));
                                },
                            },
                        ]}
                    >
                        <Input placeholder="+79991234567" allowClear />
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
                                    if (!value || getFieldValue("password") === value) return Promise.resolve();
                                    return Promise.reject(new Error("Пароли не совпадают"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Зарегистрироваться
                    </Button>

                    <div style={{ marginTop: 12, textAlign: "center" }}>
                        Уже есть аккаунт? <Link to="/login">Войти</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
}