import { Form, Input, Button } from "antd";
import { useState } from "react";
import { createTodo } from "../../api/api";

interface Props {
    onAdd: () => void;
}

const TodoForm = ({ onAdd }: Props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (values: { title: string }) => {
        try {
            setLoading(true);
            await createTodo({ title: values.title.trim() });
            form.resetFields();
            onAdd();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="inline" onFinish={handleSubmit}>
            <Form.Item
                name="title"
                rules={[
                    { required: true, message: "Введите задачу" },
                    { min: 2, message: "Минимум 2 символа" },
                    { max: 64, message: "Максимум 64 символа" },
                ]}
                style={{ flexGrow: 1 }}
            >
                <Input
                    placeholder="Новая задача"
                    allowClear
                    onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Создать
                </Button>
            </Form.Item>
        </Form>
    );
};

export default TodoForm;


