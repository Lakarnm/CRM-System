import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, Space, message, Spin, Typography, Tag, Descriptions } from "antd";
import { ArrowLeftOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getUserById, updateUserData, clearSelectedUser } from "../features/admin/adminSlice";
import { UserRequest, Roles } from "../types/types";

const { Title, Text } = Typography;

export default function UserProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { selectedUser, loading } = useAppSelector((state) => state.admin);

    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(getUserById(parseInt(id)));
        }

        return () => {
            dispatch(clearSelectedUser());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if (selectedUser) {
            form.setFieldsValue({
                username: selectedUser.username,
                email: selectedUser.email,
                phoneNumber: selectedUser.phoneNumber || ""
            });
        }
    }, [selectedUser, form]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async (values: UserRequest) => {
        if (!id) return;

        try {
            setUpdating(true);
            await dispatch(updateUserData({
                id: parseInt(id),
                data: values
            })).unwrap();

            message.success("Данные пользователя обновлены");
            setIsEditing(false);
        } catch (error: any) {
            message.error(error || "Ошибка при обновлении данных");
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        if (selectedUser) {
            form.setFieldsValue({
                username: selectedUser.username,
                email: selectedUser.email,
                phoneNumber: selectedUser.phoneNumber || ""
            });
        }
        setIsEditing(false);
    };

    const handleBack = () => {
        navigate("/users");
    };

    if (loading && !selectedUser) {
        return (
            <div style={{ display: "grid", placeItems: "center", minHeight: "50vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!selectedUser) {
        return (
            <div style={{ padding: 24 }}>
                <Card>Пользователь не найден</Card>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="content-card">
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <Space>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={handleBack}
                        >
                            Вернуться к списку
                        </Button>
                    </Space>

                    <Title level={1}>Профиль пользователя</Title>

                    <Card
                        title={
                            <Space>
                                <Text strong>{selectedUser.username}</Text>
                                <Tag color={selectedUser.isBlocked ? "red" : "green"}>
                                    {selectedUser.isBlocked ? "Заблокирован" : "Активен"}
                                </Tag>
                            </Space>
                        }
                        extra={
                            !isEditing ? (
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={handleEdit}
                                >
                                    Редактировать
                                </Button>
                            ) : (
                                <Space>
                                    <Button
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        onClick={() => form.submit()}
                                        loading={updating}
                                    >
                                        Сохранить
                                    </Button>
                                    <Button
                                        icon={<CloseOutlined />}
                                        onClick={handleCancel}
                                    >
                                        Отмена
                                    </Button>
                                </Space>
                            )
                        }
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSave}
                            disabled={!isEditing || updating}
                        >
                            <Form.Item
                                name="username"
                                label="Имя пользователя"
                                rules={[
                                    { required: true, message: 'Введите имя пользователя' },
                                    { min: 1, max: 60, message: 'От 1 до 60 символов' }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Введите email' },
                                    { type: 'email', message: 'Некорректный email' }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="phoneNumber"
                                label="Телефон"
                            >
                                <Input />
                            </Form.Item>

                            <Descriptions
                                bordered
                                size="small"
                                column={1}
                                style={{ marginBottom: 16 }}
                            >
                                <Descriptions.Item label="Роли">
                                    <Space>
                                        {selectedUser.roles.map(role => (
                                            <Tag
                                                key={role}
                                                color={
                                                    role === Roles.ADMIN ? "red" :
                                                        role === Roles.MODERATOR ? "blue" : "green"
                                                }
                                            >
                                                {role}
                                            </Tag>
                                        ))}
                                    </Space>
                                </Descriptions.Item>
                                <Descriptions.Item label="Дата регистрации">
                                    {new Date(selectedUser.date).toLocaleDateString('ru-RU')}
                                </Descriptions.Item>
                                <Descriptions.Item label="ID">
                                    {selectedUser.id}
                                </Descriptions.Item>
                            </Descriptions>
                        </Form>
                    </Card>
                </Space>
            </div>
        </div>
    );
}