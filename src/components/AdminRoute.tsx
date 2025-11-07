import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAppSelector } from "../store/hooks";
import { hasRole } from "../utils/roleUtils";
import { Roles } from "../types/types";

export default function AdminRoute() {
    const { isReady, profile, isAuthorized } = useAppSelector((state) => state.auth);

    if (!isReady) {
        return (
            <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
                <Spin />
            </div>
        );
    }

    if (!isAuthorized) {
        return <Navigate to="/login" replace />;
    }

    const hasAccess = hasRole(profile.data?.roles, [Roles.ADMIN, Roles.MODERATOR]);

    return hasAccess ? <Outlet /> : <Navigate to="/" replace />;
}