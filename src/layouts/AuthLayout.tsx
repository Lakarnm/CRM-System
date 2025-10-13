import { Card } from "antd";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-left">
                    <img className="auth-image" src="/img/png/authPicture.png" alt="Auth" />
                </div>

                <div className="auth-right">
                    <Card className="auth-form">
                        <Outlet />
                    </Card>
                </div>
            </div>
        </div>
    );
}