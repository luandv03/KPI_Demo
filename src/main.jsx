import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Schedule from "./Schedule.jsx";
import KPI from "./KPI.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/kpi" element={<KPI />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
