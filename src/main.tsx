import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { App as AntdApp } from "antd";
import { store } from "./store";
import App from "./App";
import "antd/dist/reset.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <AntdApp>
                    <App />
                </AntdApp>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);