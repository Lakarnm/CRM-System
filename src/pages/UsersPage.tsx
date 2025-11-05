import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Table, Input, Button, Space, Tag, Select, message, Popconfirm,
    Card, Tooltip, Row, Col, Typography } from "antd";
import { SearchOutlined, EyeOutlined, DeleteOutlined,
    BlockOutlined, UserSwitchOutlined, ReloadOutlined} from "@ant-design/icons";
import { getUsers, toggleBlockUser, removeUser, updateUserRights,
    setFilters, setPagination } from "../features/admin/adminSlice";
import { User, Roles } from "../types/types";
import { useNavigate } from "react-router-dom";
import RoleManagementModal from "../components/RoleManagementModal";
import { TablePaginationConfig, TableProps } from "antd/es/table";
import { SorterResult } from "antd/es/table/interface";
import type { FilterValue } from "antd/es/table/interface";

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

export default function UsersPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { users, loading, error, filters, pagination } = useAppSelector((state) => state.admin);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(getUsers());
        }, 300);

        return () => clearTimeout(timer);
    }, [dispatch, filters]);

    const [isRoleModalVisible, setIsRoleModalVisible] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchValue, setSearchValue] = useState<string>("");

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const handleSearch = (value: string) => {
        dispatch(setFilters({ search: value }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        if (value === "") {
            dispatch(setFilters({ search: "" }));
        }
    };

    const handleStatusFilter = (value: string) => {
        let isBlocked: boolean | undefined;

        if (value === "blocked") {
            isBlocked = true;
        } else if (value === "active") {
            isBlocked = false;
        } else {
            isBlocked = undefined;
        }

        dispatch(setFilters({ isBlocked }));
    };

    const handleTableChange: TableProps<User>['onChange'] = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<User> | SorterResult<User>[]
    ) => {
        dispatch(setPagination({
            current: pagination.current || 1,
            pageSize: pagination.pageSize || 10
        }));

        const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
        if (singleSorter.field) {
            dispatch(setFilters({
                sortBy: singleSorter.field as string,
                sortOrder: singleSorter.order === "ascend" ? "asc" : "desc"
            }));
        }
    };

    const handleRefresh = () => {
        dispatch(getUsers());
    };

    const handleViewProfile = (user: User) => {
        navigate(`/users/${user.id}`);
    };

    const handleBlockUser = async (user: User) => {
        try {
            await dispatch(toggleBlockUser(user.id)).unwrap();
            message.success(`Пользователь ${user.isBlocked ? 'разблокирован' : 'заблокирован'}`);
        } catch (error: unknown) {
            message.error("Ошибка при изменении статуса блокировки");
        }
    };

    const handleDeleteUser = async (userId: number) => {
        try {
            await dispatch(removeUser(userId)).unwrap();
            message.success("Пользователь удален");
        } catch (error: unknown) {
            message.error("Ошибка при удалении пользователя");
        }
    };

    const handleRoleManagement = (user: User) => {
        setSelectedUser(user);
        setIsRoleModalVisible(true);
    };

    const handleRoleUpdate = async (roles: Roles[]) => {
        if (!selectedUser) return;

        try {
            await dispatch(updateUserRights({
                id: selectedUser.id,
                roles
            })).unwrap();
            message.success("Роли пользователя обновлены");
            setIsRoleModalVisible(false);
            setSelectedUser(null);
        } catch (error: unknown) {
            message.error("Ошибка при обновлении ролей");
        }
    };

    const columns: TableProps<User>['columns'] = [
        {
            title: 'Имя пользователя',
            dataIndex: 'username',
            key: 'username',
            sorter: true,
            width: 200,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: true,
            width: 250,
        },
        {
            title: 'Дата регистрации',
            dataIndex: 'date',
            key: 'date',
            width: 150,
            render: (date: string) => date ? new Date(date).toLocaleDateString('ru-RU') : '-',
        },
        {
            title: 'Статус',
            dataIndex: 'isBlocked',
            key: 'isBlocked',
            width: 120,
            render: (isBlocked: boolean) => (
                <Tag color={isBlocked ? "red" : "green"}>
                    {isBlocked ? "Заблокирован" : "Активен"}
                </Tag>
            ),
        },
        {
            title: 'Роли',
            dataIndex: 'roles',
            key: 'roles',
            width: 200,
            render: (roles: Roles[]) => (
                <Space size="small">
                    {roles?.map(role => (
                        <Tag
                            key={role}
                            color={
                                role === Roles.ADMIN ? "red" :
                                    role === Roles.MODERATOR ? "blue" : "green"
                            }
                        >
                            {role}
                        </Tag>
                    )) || '-'}
                </Space>
            ),
        },
        {
            title: 'Телефон',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 150,
            render: (phone: string) => phone || "—",
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 200,
            fixed: 'right' as const,
            render: (_, user: User) => (
                <Space size="small">
                    <Tooltip title="Перейти к профилю">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewProfile(user)}
                        />
                    </Tooltip>

                    <Tooltip title="Управление ролями">
                        <Button
                            type="link"
                            icon={<UserSwitchOutlined />}
                            onClick={() => handleRoleManagement(user)}
                        />
                    </Tooltip>

                    <Tooltip title={user.isBlocked ? "Разблокировать" : "Заблокировать"}>
                        <Button
                            type="link"
                            icon={<BlockOutlined />}
                            danger={!user.isBlocked}
                            onClick={() => handleBlockUser(user)}
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Удалить пользователя"
                        description="Вы уверены, что хотите удалить этого пользователя?"
                        onConfirm={() => handleDeleteUser(user.id)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Tooltip title="Удалить">
                            <Button
                                type="link"
                                icon={<DeleteOutlined />}
                                danger
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const displayUsers = users || [];

    return (
        <div style={{
            padding: 24,
            minHeight: '100vh',
            background: '#fff'
        }}>
            <div style={{ maxWidth: '100%' }}>
                <h1 style={{
                    fontSize: '24px',
                    marginBottom: 24,
                    fontWeight: 600
                }}>
                    Управление пользователями
                </h1>

                <Card
                    variant="borderless"
                    styles={{
                        body: { padding: 24 }
                    }}
                >
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Search
                                placeholder="Поиск по имени или email"
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="middle"
                                onSearch={handleSearch}
                                value={searchValue}
                                onChange={handleSearchChange}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Select
                                placeholder="Статус блокировки"
                                style={{ width: '100%' }}
                                onChange={handleStatusFilter}
                                defaultValue="all"
                            >
                                <Option value="all">Все пользователи</Option>
                                <Option value="active">Только активные</Option>
                                <Option value="blocked">Только заблокированные</Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={handleRefresh}
                                loading={loading}
                            >
                                Обновить
                            </Button>
                        </Col>
                    </Row>

                    {filters.search && displayUsers.length === 0 && !loading && (
                        <div style={{
                            textAlign: 'center',
                            padding: '20px',
                            marginBottom: 16,
                            border: '1px dashed #d9d9d9',
                            borderRadius: 6,
                            backgroundColor: '#fafafa'
                        }}>
                            <Text type="secondary">
                                По запросу "{filters.search}" пользователи не найдены
                            </Text>
                        </div>
                    )}

                    {filters.isBlocked === true && displayUsers.length === 0 && !loading && (
                        <div style={{
                            textAlign: 'center',
                            padding: '20px',
                            marginBottom: 16,
                            border: '1px dashed #d9d9d9',
                            borderRadius: 6,
                            backgroundColor: '#fafafa'
                        }}>
                            <Text type="secondary">
                                Заблокированные пользователи не найдены
                            </Text>
                        </div>
                    )}

                    {filters.isBlocked === false && displayUsers.length === 0 && !loading && (
                        <div style={{
                            textAlign: 'center',
                            padding: '20px',
                            marginBottom: 16,
                            border: '1px dashed #d9d9d9',
                            borderRadius: 6,
                            backgroundColor: '#fafafa'
                        }}>
                            <Text type="secondary">
                                Активные пользователи не найдены
                            </Text>
                        </div>
                    )}

                    {displayUsers.length === 0 && !loading ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 0',
                            border: '1px solid #f0f0f0',
                            borderRadius: 6
                        }}>
                            <Text type="secondary">
                                {filters.search || filters.isBlocked !== undefined
                                    ? "Пользователи не найдены"
                                    : "Нет пользователей"
                                }
                            </Text>
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={displayUsers.map(user => ({ ...user, key: user.id }))}
                            rowKey="id"
                            loading={loading}
                            pagination={{
                                current: pagination.current,
                                pageSize: pagination.pageSize,
                                total: pagination.total,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '50'],
                                showQuickJumper: false,
                                size: 'default',
                                showTotal: (total, range) =>
                                    `Показано ${range[0]}-${range[1]} из ${total} пользователей`
                            }}
                            onChange={handleTableChange}
                            scroll={{ x: 1300 }}
                        />
                    )}
                </Card>

                <RoleManagementModal
                    visible={isRoleModalVisible}
                    user={selectedUser}
                    onCancel={() => {
                        setIsRoleModalVisible(false);
                        setSelectedUser(null);
                    }}
                    onSave={handleRoleUpdate}
                />
            </div>
        </div>
    );
}