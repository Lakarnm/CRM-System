import { Form as AntForm, Input, Button } from "antd";
import { useState } from "react";
import { createTodo } from "../../api/api";

interface Props {
    onAdd: () => void;
}

const TodoForm = ({ onAdd }: Props) => {
    const [form] = AntForm.useForm();
    const [loading, setLoading] = useState(false);

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
        <AntForm form={form} layout="inline" onFinish={handleSubmit}>
            <AntForm.Item
                name="title"
                rules={[
                    { required: true, message: "Введите задачу" },
                    { min: 2, message: "Минимум 2 символа" },
                    { max: 64, message: "Максимум 64 символа" },
                ]}
                style={{ flexGrow: 1 }}
            >
                <Input placeholder="Новая задача" allowClear />
            </AntForm.Item>
            <AntForm.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Создать
                </Button>
            </AntForm.Item>
        </AntForm>
    );
};

export default TodoForm;


