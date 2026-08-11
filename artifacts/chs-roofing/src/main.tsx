import "./polyfills"; // Buffer polyfill — must be first
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n";
import ErrorBoundary from "./components/ErrorBoundary";
import { installClarity } from "./lib/clarity";

// Fire Microsoft Clarity as soon as the app boots. It self-skips
// if VITE_CLARITY_ID isn't set, so it's a no-op until the client
// drops their Clarity project ID into Replit Secrets.
installClarity();

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>,
  );
}
