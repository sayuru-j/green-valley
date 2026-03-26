import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { authFetch, getToken } from "@/lib/auth";

type Props = {
  children: ReactNode;
};

const AdminRoute = ({ children }: Props) => {
  const [verified, setVerified] = useState(false);
  const [checkFailed, setCheckFailed] = useState(false);
  const token = getToken();

  useEffect(() => {
    if (!token) return;

    (async () => {
      const res = await authFetch("/api/admin/me");
      if (res.ok) {
        setVerified(true);
      } else if (res.status !== 401) {
        setCheckFailed(true);
      }
    })();
  }, [token]);

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  if (checkFailed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-gray-700">Could not verify your session.</p>
        <a href="/admin-login" className="text-green-700 underline">
          Back to admin login
        </a>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
