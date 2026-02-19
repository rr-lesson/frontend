import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { setDefaultOptions } from "date-fns";
import { id } from "date-fns/locale";
import { client } from "./api/client.gen.ts";
import { checkForOtaUpdates } from "./lib/ota-update.ts";
import reportWebVitals from "./reportWebVitals.ts";
import "./styles.css";

setDefaultOptions({ locale: id });
client.setConfig({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: "include",
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultViewTransition: true,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// capacitor js
CapacitorApp.addListener("backButton", ({ canGoBack }) => {
  if (canGoBack) {
    router.history.back();
  } else {
    CapacitorApp.exitApp();
  }
});

const bootstrap = async () => {
  if (Capacitor.isNativePlatform()) {
    console.log("Running on native platform, checking for OTA updates...");
    try {
      await checkForOtaUpdates();
    } catch (e) {
      console.error("Live update error:", e);
    }
  }

  // Render the app
  const rootElement = document.getElementById("app");
  if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>,
    );
  }
};

bootstrap();
