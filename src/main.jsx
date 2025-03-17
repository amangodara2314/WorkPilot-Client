import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import GlobalContext from "./context/GlobalContext";

createRoot(document.getElementById("root")).render(
  <GlobalContext>
    <App />
  </GlobalContext>
);
