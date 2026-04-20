import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppProviders from "./AppProviders.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>
);


