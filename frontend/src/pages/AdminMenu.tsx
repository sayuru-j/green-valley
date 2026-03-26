import { useEffect, useState } from "react";
import AdminSidebar from "../components/ui/AdminSidebar";
import { authFetch } from "@/lib/auth";
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message, Select, Switch } from "antd";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string | null;
  dietary_note?: string | null;
  is_featured?: number | boolean;
  display_order?: number;
}

const AdminMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MenuItem | null>(null);
  const [form] = Form.useForm();
  
  const fetchItems = async () => {
    try {
      const res = await authFetch("/api/menu");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      message.error("Failed to load menu items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({ display_order: 0, is_featured: false });
    setIsModalVisible(true);
  };

  const handleEdit = (record: MenuItem) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      display_order: record.display_order ?? 0,
      is_featured: !!(record.is_featured === true || Number(record.is_featured) === 1),
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await authFetch(`/api/menu/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        message.success("Deleted successfully");
        fetchItems();
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
        ? `/api/menu/${editingRecord.id}`
        : "/api/menu";

      const method = editingRecord ? "PUT" : "POST";

      const res = await authFetch(path, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        message.success(`Menu item ${editingRecord ? 'updated' : 'added'} successfully`);
        setIsModalVisible(false);
        fetchItems();
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
      render: (_: unknown, record: MenuItem) =>
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
    { title: "Featured", dataIndex: "is_featured", key: "is_featured", width: 88, render: (v: number) => (Number(v) === 1 ? "Yes" : "—") },
    { title: "Order", dataIndex: "display_order", key: "display_order", width: 72 },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Description", dataIndex: "description", key: "description" },
    { 
      title: "Price (LKR)", 
      dataIndex: "price", 
      key: "price",
      render: (price: number) => price?.toLocaleString()
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: MenuItem) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Delete this item?" onConfirm={() => handleDelete(record.id)}>
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
          <h2 className="text-3xl font-bold text-gray-800">Manage Restaurant Menu</h2>
          <Button type="primary" size="large" onClick={handleAdd}>Add Menu Item</Button>
        </div>

        <Table 
          dataSource={items} 
          columns={columns} 
          rowKey="id" 
          bordered 
          className="bg-white shadow-lg rounded-lg"
        />

      <Modal
        title={editingRecord ? "Edit Menu Item" : "Add Menu Item"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleModalSubmit}>
          <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Sri Lankan Rice & Curry" />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select a category" mode="tags">
              <Select.Option value="🍛 Main Dishes">🍛 Main Dishes</Select.Option>
              <Select.Option value="🥘 Signature Specials">🥘 Signature Specials</Select.Option>
              <Select.Option value="🥥 Beverages">🥥 Beverages</Select.Option>
              <Select.Option value="🍰 Desserts">🍰 Desserts</Select.Option>
              <Select.Option value="🥗 Starters">🥗 Starters</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Item details..." />
          </Form.Item>
          <Form.Item name="price" label="Price (LKR)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} placeholder="e.g. 3500" />
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
          <Form.Item
            name="dietary_note"
            label="Dietary note"
            rules={[{ max: 255, message: "Max 255 characters" }]}
          >
            <Input placeholder="e.g. Vegetarian, Spicy" allowClear />
          </Form.Item>
          <Form.Item name="is_featured" label="Featured" valuePropName="checked" initialValue={false}>
            <Switch />
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

export default AdminMenu;
