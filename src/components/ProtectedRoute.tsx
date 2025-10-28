import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAppSelector } from "../store/hooks";

export default function ProtectedRoute() {
    const isReady = useAppSelector((selector) => selector.auth.isReady);
    const isAuthorization = useAppSelector((selector) => selector.auth.isAuthorization);
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

    return isAuthorization ? <Outlet /> : <Navigate to="/login" replace />;
}