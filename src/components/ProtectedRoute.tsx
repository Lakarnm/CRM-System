import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAppSelector } from "../store/hooks";

export default function ProtectedRoute() {
    const isReady = useAppSelector((s) => s.auth.isReady);
    const isAuthorization = useAppSelector((s) => s.auth.isAuthorization);

    if (!isReady) {
        return (
            <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
                <Spin />
            </div>
        );
    }

    return isAuthorization ? <Outlet /> : <Navigate to="/login" replace />;
}
