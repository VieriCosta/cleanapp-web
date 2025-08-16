import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import LoginPage from "@/pages/Login";
import OffersPage from "@/pages/Offers";
import CustomerJobs from "@/pages/CustomerJobs";
import ConversationsPage from "@/pages/Conversations";
import ConversationDetail from "@/pages/ConversationDetail";
import ProviderDashboard from "@/pages/ProviderJobs";
import { Protected } from "@/components/Protected";
import HowItWorks from "@/pages/HowItWorks";
import RegisterPage from "./pages/Register";

function NotFound() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold mb-2">Página não encontrada</h1>
      <p className="opacity-70">A rota acessada não existe.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* rotas com layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route
          path="app/offers"
          element={
            <Protected>
              <OffersPage />
            </Protected>
          }
        />
        <Route
          path="app/jobs"
          element={
            <Protected>
              <CustomerJobs />
            </Protected>
          }
        />
        <Route
          path="app/conversations"
          element={
            <Protected>
              <ConversationsPage />
            </Protected>
          }
        />
        <Route
          path="app/conversations/:id"
          element={
            <Protected>
              <ConversationDetail />
            </Protected>
          }
        />
        <Route
          path="app/provider"
          element={
            <Protected roles={["provider", "admin"]}>
              <ProviderDashboard />
            </Protected>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* rotas fora do layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app" element={<Navigate to="/" replace />} />
      <Route path="/como-funciona" element={<HowItWorks />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
