import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../components/ui/AdminSidebar";
import { authFetch } from "@/lib/auth";
import { Tabs, message } from "antd";

interface Booking {
  id: number;
  name: string;
  room: string;
  checkin: string | Date;
  checkout: string | Date;
  people: number;
  email: string;
  contact: string;
  status: string;
}

function formatBookingDateDisplay(value: string | Date | null | undefined): string {
  if (value == null || value === "") return "—";
  try {
    let d: Date;
    if (value instanceof Date) {
      d = value;
    } else {
      const s = String(value);
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        d = new Date(`${s}T12:00:00`);
      } else {
        d = new Date(s);
      }
    }
    if (Number.isNaN(d.getTime())) return String(value);
    return new Intl.DateTimeFormat("en", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return String(value);
  }
}

const overviewLinks = [
  { to: "/admin/rooms", label: "Rooms" },
  { to: "/admin/menu", label: "Restaurant menu" },
  { to: "/admin/banquet", label: "Banquet packages" },
  { to: "/admin/reviews", label: "Guest reviews" },
];

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchBookings = async () => {
    try {
      const res = await authFetch("/api/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      message.error("Failed to load bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const putRes = await authFetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!putRes.ok) {
        message.error("Update failed");
        return;
      }
      message.success(
        status === "accepted"
          ? "Booking accepted. Confirmation email sent to the guest."
          : "Booking rejected. Guest has been notified by email."
      );
      fetchBookings();
    } catch {
      message.error("Update failed");
    }
  };

  const bookingsTable = (
    <div className="overflow-x-auto">
      <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-300 text-gray-700">
          <tr>
            <th className="p-3">Guest</th>
            <th className="p-3">Room</th>
            <th className="p-3">Check-in</th>
            <th className="p-3">Check-out</th>
            <th className="p-3">People</th>
            <th className="p-3">Email</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan={9} className="p-5 text-center text-gray-500">
                No bookings found
              </td>
            </tr>
          ) : (
            bookings.map((b) => (
              <tr key={b.id} className="text-center border-t hover:bg-gray-50">
                <td className="p-3 text-left max-w-[140px]">{b.name}</td>
                <td className="p-3">{b.room}</td>
                <td className="p-3 text-left text-sm max-w-[200px]">
                  {formatBookingDateDisplay(b.checkin)}
                </td>
                <td className="p-3 text-left text-sm max-w-[200px]">
                  {formatBookingDateDisplay(b.checkout)}
                </td>
                <td className="p-3">{b.people}</td>
                <td className="p-3 text-sm break-all max-w-[160px]">{b.email}</td>
                <td className="p-3">{b.contact}</td>
                <td
                  className={`p-3 font-semibold ${
                    b.status === "accepted"
                      ? "text-green-600"
                      : b.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {b.status}
                </td>
                <td className="p-3 space-x-2 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => updateStatus(b.id, "accepted")}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-gray-400"
                    disabled={b.status === "accepted"}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(b.id, "rejected")}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-400"
                    disabled={b.status === "rejected"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const overviewTab = (
    <div className="max-w-xl">
      <p className="text-gray-700 mb-6">
        Welcome to the Green Valley admin area. Use the Bookings tab to accept or reject reservation
        requests. Manage catalog content and guest reviews from the links below or the sidebar.
      </p>
      <ul className="space-y-3">
        {overviewLinks.map(({ to, label }) => (
          <li key={to}>
            <Link to={to} className="text-forest font-medium hover:underline">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-10 bg-gradient-to-br from-gray-100 to-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin</h1>
        <Tabs
          defaultActiveKey="bookings"
          items={[
            { key: "bookings", label: "Bookings", children: bookingsTable },
            { key: "overview", label: "Overview", children: overviewTab },
          ]}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
