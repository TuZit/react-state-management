import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ZustandPage from "./pages/zustand/ZustandPage";
import ReduxToolkitPage from "./pages/redux-toolkit/ReduxToolkitPage";
import ReduxPage from "./pages/redux/ReduxPage";
import ContextPage from "./pages/context-api/ContextPage";
import { Provider } from "react-redux";
import { store } from "./pages/redux-toolkit/store";
import SWRPage from "./pages/swr/SWRPage";
import ReactQueryPage from "./pages/react-query/ReactQueryPage";
import RTKQueryPage from "./pages/redux-toolkit-query/RTKQueryPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/context-api" element={<ContextPage />} />
        <Route path="/zustand" element={<ZustandPage />} />
        <Route path="/redux" element={<ReduxPage />} />
        <Route path="/redux-toolkit" element={<ReduxToolkitPage />} />
        <Route path="/swr" element={<SWRPage />} />
        <Route path="/react-query" element={<ReactQueryPage />} />
        <Route path="/rtk-query" element={<RTKQueryPage />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
