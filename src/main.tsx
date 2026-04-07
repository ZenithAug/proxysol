import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppProvider } from "./stores/useAppStore.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    'Failed to find root element. Make sure there is a div with id "root" in your HTML.',
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);
