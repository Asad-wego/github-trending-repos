import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./pages/Home";
import reportWebVitals from "./reportWebVitals";
import "./i18n";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
reportWebVitals();
