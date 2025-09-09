import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAppSelector } from "../store/hooks";

export default function ProtectedRoute() {
    const isReady = useAppSelector((s) => s.auth.isReady);
    const isAuth = useAppSelector((s) => s.auth.isAuth);

    if (!isReady) {
        return (
            <div style={{ display: "grid", placeItems: "center", minHeight: "50vh" }}>
                <Spin spinning size="large" />
            </div>
        );
    }

    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}