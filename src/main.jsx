import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import GlobalContext from "./context/GlobalContext";
import { ErrorBoundary } from "./ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <GlobalContext>
      <App />
    </GlobalContext>
  </ErrorBoundary>
);
