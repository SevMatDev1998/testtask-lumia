import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { LumiaPassportProvider, LumiaPassportSessionProvider } from "@lumiapassport/ui-kit";
import "@lumiapassport/ui-kit/dist/styles.css";
import { queryClient } from "./lib/queryClient";
import "./index.css";
import App from "./App.tsx";

const projectId = import.meta.env.VITE_LUMIA_PROJECT_ID || "";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LumiaPassportProvider projectId={projectId}>
        <LumiaPassportSessionProvider>
          <App />
        </LumiaPassportSessionProvider>
      </LumiaPassportProvider>
    </QueryClientProvider>
  </StrictMode>
);
