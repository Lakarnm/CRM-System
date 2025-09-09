import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { initAuth } from "./features/auth/authSlice";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";

import TodoListPage from "./pages/TodoListPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
    const dispatch = useAppDispatch();
    const isAuthorization = useAppSelector((s) => s.auth.isAuthorization);

    useEffect(() => {
        dispatch(initAuth());
    }, [dispatch]);

    return (
        <Routes>
            {/* public */}
            <Route element={<AuthLayout />}>
                <Route
                    path="/login"
                    element={isAuthorization ? <Navigate to="/" replace /> : <LoginPage />}
                />
                <Route
                    path="/register"
                    element={isAuthorization ? <Navigate to="/" replace /> : <RegisterPage />}
                />
                <Route path="/signup" element={<Navigate to="/register" replace />} />
            </Route>

            {/* Private */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route index element={<TodoListPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}