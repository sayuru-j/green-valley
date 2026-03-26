import { useEffect, useState } from "react";
import AdminSidebar from "../components/ui/AdminSidebar";
import { authFetch } from "@/lib/auth";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Tag,
} from "antd";

interface GuestReviewRow {
  id: number;
  guest_name: string;
  location: string | null;
  rating: number;
  body: string;
  is_approved: number;
  created_at: string;
}

const AdminReviews = () => {
  const [rows, setRows] = useState<GuestReviewRow[]>([]);

  const fetchAll = async () => {
    try {
      const res = await authFetch("/api/reviews/all");
      const data = await res.json();
      if (Array.isArray(data)) {
        setRows(data);
      }
    } catch {
      message.error("Failed to load reviews");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const patchApproval = async (id: number, is_approved: boolean) => {
    try {
      const res = await authFetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved }),
      });
      if (res.ok) {
        message.success(is_approved ? "Approved" : "Unpublished");
        fetchAll();
      } else {
        message.error("Update failed");
      }
    } catch {
      message.error("Update failed");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await authFetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        message.success("Deleted");
        fetchAll();
      } else {
        message.error("Delete failed");
      }
    } catch {
      message.error("Delete failed");
    }
  };

  const columns = [
    {
      title: "Status",
      dataIndex: "is_approved",
      key: "status",
      width: 100,
      render: (v: number) =>
        Number(v) === 1 ? (
          <Tag color="green">Approved</Tag>
        ) : (
          <Tag color="orange">Pending</Tag>
        ),
    },
    { title: "Guest", dataIndex: "guest_name", key: "guest_name" },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
      render: (v: string | null) => v || "—",
    },
    { title: "Rating", dataIndex: "rating", key: "rating", width: 72 },
    {
      title: "Excerpt",
      dataIndex: "body",
      key: "body",
      ellipsis: true,
      render: (t: string) => (t.length > 80 ? `${t.slice(0, 80)}…` : t),
    },
    {
      title: "Submitted",
      dataIndex: "created_at",
      key: "created_at",
      width: 160,
      render: (d: string) => {
        try {
          return new Date(d).toLocaleString();
        } catch {
          return d;
        }
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 280,
      render: (_: unknown, record: GuestReviewRow) => (
        <Space size="small" wrap>
          {Number(record.is_approved) !== 1 ? (
            <Button type="primary" size="small" onClick={() => patchApproval(record.id, true)}>
              Approve
            </Button>
          ) : (
            <Button size="small" onClick={() => patchApproval(record.id, false)}>
              Unpublish
            </Button>
          )}
          <Popconfirm title="Delete this review permanently?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger type="link">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-10 pt-28 bg-gradient-to-br from-gray-100 to-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Guest reviews</h2>
        <p className="text-gray-600 mb-6 max-w-2xl">
          Approve submissions to show them on the public Reviews page. Reject or delete spam or inappropriate
          content.
        </p>
        <Table
          dataSource={rows}
          columns={columns}
          rowKey="id"
          bordered
          className="bg-white shadow-lg rounded-lg"
        />
      </div>
    </div>
  );
};

export default AdminReviews;
