import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProfileThunk } from "../features/auth/authSlice";

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const loadedRef = useRef(false);
    const user = useAppSelector((s) => s.auth.profile);
    const isAuth = useAppSelector((s) => !!(s.auth.profile || s.auth.accessToken));

    useEffect(() => {
        if (!loadedRef.current && isAuth && !user) {
            loadedRef.current = true;
            dispatch(fetchProfileThunk());
        }
    }, [dispatch, isAuth, user]);

    if (!user) return <div>Загрузка...</div>;

    return (
        <div style={{padding: 24}}>
            <h2>Профиль</h2>
            <div>Email: {user.email}</div>
            <div>ID: {user.id}</div>
            <div>Phone: {user.phoneNumber}</div>
            {user.username && <div>Имя: {user.username}</div>}
        </div>
    );
}