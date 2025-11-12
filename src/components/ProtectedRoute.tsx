import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAppSelector } from "../store/hooks";

export default function ProtectedRoute() {
    const isReady = useAppSelector((selector) => selector.auth.isReady);
    const isAuthorized = useAppSelector((selector) => selector.auth.isAuthorized);
    const profile = useAppSelector((selector) => selector.auth.profile.data);

    if (!isReady) {
        return (
            <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
                <Spin />
            </div>
        );
    }

    if (profile?.isBlocked) {
        return <Navigate to="/login" replace />;
    }

    return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
}