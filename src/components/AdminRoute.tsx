import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAppSelector } from "../store/hooks";
import { hasAdminOrModeratorRole } from "../utils/roleUtils";

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

    const hasAccess = hasAdminOrModeratorRole(profile.data?.roles);

    return hasAccess ? <Outlet /> : <Navigate to="/" replace />;
}