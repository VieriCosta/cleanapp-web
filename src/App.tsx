import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import HowItWorks from "@/pages/HowItWorks";
import PricingPage from "@/pages/Pricing";

import OffersPage from "@/pages/Offers";
import CustomerJobs from "@/pages/CustomerJobs";
import ConversationsPage from "@/pages/Conversations";
import ConversationDetail from "@/pages/ConversationDetail";
import ProviderDashboard from "@/pages/ProviderDashboard"; // <— usar este como principal

import AddressesPage from "@/pages/Addresses";
import ProfilePage from "@/pages/Profile";
import CustomerDashboard from "@/pages/CustomerDashboard";

import { Protected } from "@/components/Protected";

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
      {/* TODAS as páginas “públicas” e “internas” usando o mesmo Layout (ganham header/footer) */}
      <Route path="/" element={<Layout />}>
        {/* públicas */}
        <Route index element={<Home />} />
        <Route path="como-funciona" element={<HowItWorks />} />
        <Route path="precos" element={<PricingPage />} />

        {/* área logada (/app/...) */}
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

        {/* NOVAS ROTAS que estavam “sobrando” */}
        <Route
          path="app/addresses"
          element={
            <Protected>
              <AddressesPage />
            </Protected>
          }
        />

        <Route
          path="app/profile"
          element={
            <Protected>
              <ProfilePage />
            </Protected>
          }
        />

        <Route
          path="app/dashboard"
          element={
            <Protected>
              <CustomerDashboard />
            </Protected>
          }
        />

        {/* provider */}
        <Route
          path="app/provider"
          element={
            <Protected roles={["provider", "admin"]}>
              <ProviderDashboard />
            </Protected>
          }
        />

        {/* catch-all */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* fora do layout: auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* compat: enviar /app para / */}
      <Route path="/app" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
