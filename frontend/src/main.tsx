import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./layouts/layout";
import { ThemeProivder, ThemeProvider } from "./context/ThemeProvider.tsx";
import "./index.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <Layout />
        </ThemeProvider>
    </React.StrictMode>,
);
