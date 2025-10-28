import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAppSelector } from "../store/hooks";

export default function AdminRoute() {
    const { isReady, profile } = useAppSelector((state) => state.auth);
    const isAuthorization = useAppSelector((state) => state.auth.isAuthorization);

    if (!isReady) {
        return (
            <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
                <Spin />
            </div>
        );
    }

    if (!isAuthorization) {
        return <Navigate to="/login" replace />;
    }

    const userRoles = profile.data?.roles || [];
    const hasAccess = userRoles.includes('ADMIN') || userRoles.includes('MODERATOR');

    return hasAccess ? <Outlet /> : <Navigate to="/" replace />;
}