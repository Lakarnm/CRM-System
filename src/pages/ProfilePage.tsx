import { useEffect } from "react";
import { Card, Spin } from "antd";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProfileThunk } from "../features/auth/authSlice";
import { selectProfileView } from "../features/auth/selectors";

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const { data: profile, status } = useAppSelector(selectProfileView);
    useEffect(() => {
        if (status.isIdle) {
            dispatch(fetchProfileThunk());
        }
    }, [status.isIdle, dispatch]);

    if (status.isLoadingOrIdle) {
        return (
            <div style={{ display: "grid", placeItems: "center", minHeight: "50vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={{ padding: 24 }}>
                <Card>Не удалось загрузить профиль.</Card>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="content-card">
                <h1 className="page-title">Профиль</h1>
                <div style={{ lineHeight: 1.9 }}>
                    <div><b>Почта:</b> {profile.email}</div>
                    <div><b>Телефон:</b> {profile.phoneNumber || "—"}</div>
                    <div><b>Логин:</b> {profile.username}</div>
                </div>
            </div>
        </div>
    );
}