import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { App as AntdApp } from "antd";
import { store } from "./store";
import { useAppDispatch } from "./store/hooks";
import { initAuth } from "./features/auth/authSlice";

import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";

import TodoListPage from "./pages/TodoListPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";


function AppContent() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initAuth());
    }, [dispatch]);

    return (
        <Routes>
            {/* Public routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<AuthLayout />}>
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Private routes */}
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

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <AntdApp>
                    <AppContent />
                </AntdApp>
            </BrowserRouter>
        </Provider>
    );
}

export default App;