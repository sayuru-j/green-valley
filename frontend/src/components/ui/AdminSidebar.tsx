import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "@/lib/auth";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/admin-login");
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-6">

      <h2 className="text-xl font-bold mb-10">
        Green Valley Admin
      </h2>

      <nav className="space-y-4">

        <Link
          to="/admin"
          className="block hover:text-yellow-400"
        >
          Home
        </Link>

        <Link
          to="/admin/banquet"
          className="block hover:text-yellow-400"
        >
          Banquet halls
        </Link>

        <Link
          to="/admin/rooms"
          className="block hover:text-yellow-400"
        >
          Rooms
        </Link>

        <Link
          to="/admin/menu"
          className="block hover:text-yellow-400"
        >
          Restaurant Menu
        </Link>

        <Link
          to="/admin/reviews"
          className="block hover:text-yellow-400"
        >
          Guest reviews
        </Link>

        <button
          onClick={handleLogout}
          className="mt-10 bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </nav>
    </div>
  );
};

export default AdminSidebar;