import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n";
import ErrorBoundary from "./components/ErrorBoundary";

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>,
  );
}
