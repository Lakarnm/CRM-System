import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAppSelector } from "../store/hooks";
import { selectIsReady, selectIsAuthorized, selectHasAdminOrModeratorRole } from "../features/auth/authSlice";

export default function AdminRoute() {
    const isReady = useAppSelector(selectIsReady);
    const isAuthorized = useAppSelector(selectIsAuthorized);
    const hasAccess = useAppSelector(selectHasAdminOrModeratorRole);

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

    return hasAccess ? <Outlet /> : <Navigate to="/" replace />;
}