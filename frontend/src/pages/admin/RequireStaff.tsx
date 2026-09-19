import { Navigate, Outlet } from "react-router-dom";
import { getStaffUser, getToken } from "../../lib/api";

export function RequireStaff({ roles }: { roles?: Array<"admin" | "receptionist"> }) {
  const token = getToken();
  const user = getStaffUser();
  if (!token || !user) return <Navigate to="/admin/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/admin/bookings" replace />;
  return <Outlet />;
}
