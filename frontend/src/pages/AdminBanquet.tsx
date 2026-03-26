import { useEffect, useState } from "react";
import AdminSidebar from "../components/ui/AdminSidebar";
import { authFetch } from "@/lib/auth";
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message } from "antd";

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string | null;
  max_guests?: number | null;
  highlights?: string | null;
  display_order?: number;
}

const AdminBanquet = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Package | null>(null);
  const [form] = Form.useForm();
  
  const fetchPackages = async () => {
    try {
      const res = await authFetch("/api/banquet-packages");
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      message.error("Failed to load packages");
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({ display_order: 0 });
    setIsModalVisible(true);
  };

  const handleEdit = (record: Package) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      display_order: record.display_order ?? 0,
      max_guests: record.max_guests ?? undefined,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await authFetch(`/api/banquet-packages/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        message.success("Deleted successfully");
        fetchPackages();
      } else {
        message.error("Failed to delete");
      }
    } catch (e) {
      message.error("Failed to delete");
    }
  };

  const handleModalSubmit = async (values: any) => {
    try {
      const path = editingRecord
        ? `/api/banquet-packages/${editingRecord.id}`
        : "/api/banquet-packages";

      const method = editingRecord ? "PUT" : "POST";

      const res = await authFetch(path, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        message.success(`Package ${editingRecord ? 'updated' : 'added'} successfully`);
        setIsModalVisible(false);
        fetchPackages();
      } else {
        message.error("Action failed");
      }
    } catch (e) {
      message.error("Action failed");
    }
  };

  const columns = [
    {
      title: "Thumb",
      key: "thumb",
      width: 72,
      render: (_: unknown, record: Package) =>
        record.image_url ? (
          <img
            src={record.image_url}
            alt=""
            className="w-14 h-14 object-cover rounded-md"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Order", dataIndex: "display_order", key: "display_order", width: 72 },
    { title: "Description", dataIndex: "description", key: "description", ellipsis: true },
    { 
      title: "Price (LKR)", 
      dataIndex: "price", 
      key: "price",
      render: (price: number) => price?.toLocaleString()
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Package) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Delete this package?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-10 pt-28 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Manage Banquet Packages</h2>
          <Button type="primary" size="large" onClick={handleAdd}>Add Package</Button>
        </div>

        <Table 
          dataSource={packages} 
          columns={columns} 
          rowKey="id" 
          bordered 
          className="bg-white shadow-lg rounded-lg"
        />

      <Modal
        title={editingRecord ? "Edit Package" : "Add Package"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleModalSubmit}>
          <Form.Item name="name" label="Package Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Wedding Package" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Package details..." />
          </Form.Item>
          <Form.Item name="price" label="Price (LKR)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} placeholder="e.g. 1200000" />
          </Form.Item>
          <Form.Item
            name="image_url"
            label="Image URL"
            rules={[
              {
                validator: async (_, value) => {
                  if (value == null || String(value).trim() === "") return;
                  const s = String(value).trim();
                  try {
                    const u = new URL(s);
                    if (u.protocol !== "http:" && u.protocol !== "https:") {
                      throw new Error();
                    }
                  } catch {
                    throw new Error("Enter a valid http(s) URL");
                  }
                },
              },
            ]}
          >
            <Input placeholder="https://..." allowClear />
          </Form.Item>
          <Form.Item name="max_guests" label="Max guests">
            <InputNumber min={1} style={{ width: "100%" }} placeholder="Optional capacity" />
          </Form.Item>
          <Form.Item name="highlights" label="Highlights">
            <Input.TextArea rows={4} placeholder="One line per bullet-style line (optional)" />
          </Form.Item>
          <Form.Item name="display_order" label="Display order" initialValue={0}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
      </div>
    </div>
  );
};

export default AdminBanquet;