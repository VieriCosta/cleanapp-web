import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./store/auth";
import { ThemeProvider } from "./store/theme";
import "./index.css";
import { Toaster } from "sonner";
import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster richColors />
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
