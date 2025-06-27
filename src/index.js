import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ZustandPage from "./pages/zustand/ZustandPage";
import ReduxToolkitPage from "./pages/redux-toolkit/ReduxToolkitPage";
import ReduxPage from "./pages/redux/ReduxPage";
import ContextPage from "./pages/context-api/ContextPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/context-api" element={<ContextPage />} />
      <Route path="/zustand" element={<ZustandPage />} />
      <Route path="/redux" element={<ReduxPage />} />
      <Route path="/redux-toolkit" element={<ReduxToolkitPage />} />
    </Routes>
  </BrowserRouter>
);
