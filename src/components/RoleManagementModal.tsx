import { Modal, Checkbox, List, Typography, Space, Tag, Alert } from "antd";
import { User, Roles } from "../types/types";
import { useState, useEffect } from "react";

const { Text, Title } = Typography;

interface RoleManagementModalProps {
    visible: boolean;
    user: User | null;
    onCancel: () => void;
    onSave: (roles: Roles[]) => void;
}

const ROLE_DESCRIPTIONS = {
    [Roles.USER]: "Базовая роль, возможность работать с задачами",
    [Roles.MODERATOR]: "Может управлять пользователями (блокировка, просмотр)",
    [Roles.ADMIN]: "Полный доступ ко всем функциям системы"
};

const ROLE_COLORS = {
    [Roles.USER]: "green",
    [Roles.MODERATOR]: "blue",
    [Roles.ADMIN]: "red"
};

export default function RoleManagementModal({ visible, user, onCancel, onSave }: RoleManagementModalProps) {
    const [selectedRoles, setSelectedRoles] = useState<Roles[]>([]);

    useEffect(() => {
        if (user) {
            setSelectedRoles([...user.roles]);
        }
    }, [user]);

    const handleRoleChange = (role: Roles, checked: boolean) => {
        if (checked) {
            setSelectedRoles(prev => [...prev, role]);
        } else {
            setSelectedRoles(prev => prev.filter(r => r !== role));
        }
    };

    const handleSave = () => {
        if (selectedRoles.length === 0) {
            return;
        }
        onSave(selectedRoles);
    };

    const isCurrentUser = user?.username === "admin";

    return (
        <Modal
            title="Управление ролями пользователя"
            open={visible}
            onCancel={onCancel}
            onOk={handleSave}
            okText="Сохранить"
            cancelText="Отмена"
            width={600}
            okButtonProps={{ disabled: selectedRoles.length === 0 }}
        >
            {user && (
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div>
                        <Text strong>Пользователь: </Text>
                        <Text>{user.username}</Text>
                    </div>

                    <div>
                        <Text strong>Текущие роли: </Text>
                        <Space>
                            {user.roles.map(role => (
                                <Tag key={role} color={ROLE_COLORS[role]}>
                                    {role}
                                </Tag>
                            ))}
                        </Space>
                    </div>

                    {isCurrentUser && (
                        <Alert
                            message="Внимание"
                            description="Вы редактируете роли текущего пользователя. Изменения вступят в силу после перезагрузки страницы."
                            type="warning"
                            showIcon
                        />
                    )}

                    <List
                        header={<Title level={5}>Выберите роли:</Title>}
                        bordered
                        dataSource={Object.values(Roles)}
                        renderItem={(role) => (
                            <List.Item>
                                <Checkbox
                                    checked={selectedRoles.includes(role)}
                                    onChange={(e) => handleRoleChange(role, e.target.checked)}
                                    disabled={isCurrentUser && role === Roles.ADMIN}
                                >
                                    <Space direction="vertical" size="small">
                                        <Tag color={ROLE_COLORS[role]}>{role}</Tag>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            {ROLE_DESCRIPTIONS[role]}
                                        </Text>
                                    </Space>
                                </Checkbox>
                            </List.Item>
                        )}
                    />

                    {selectedRoles.length === 0 && (
                        <Alert
                            message="Предупреждение"
                            description="Пользователь должен иметь хотя бы одну роль."
                            type="warning"
                            showIcon
                        />
                    )}
                </Space>
            )}
        </Modal>
    );
}