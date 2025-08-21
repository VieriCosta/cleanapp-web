// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import LoginPage from "@/pages/Login";
import OffersPage from "@/pages/Offers";
import CustomerJobs from "@/pages/CustomerJobs";
import ConversationsPage from "@/pages/Conversations";
import ConversationDetail from "@/pages/ConversationDetail";
import { Protected } from "@/components/Protected";
import HowItWorks from "@/pages/HowItWorks";
import RegisterPage from "@/pages/Register";
import PricingPage from "@/pages/Pricing";
import ProfilePage from "@/pages/Profile";
import FAQPage from "@/pages/FAQ";
import HelpCenter from "@/pages/HelpCenter";
import ContactPage from "@/pages/Contact";
import ProviderServices from "@/pages/ProviderServices";
import ProviderPublic from "@/pages/ProviderPublic";


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
      {/* tudo que deve ter Header/Footer */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* páginas públicas */}
        <Route path="como-funciona" element={<HowItWorks />} />
        <Route path="precos" element={<PricingPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="ajuda" element={<HelpCenter />} />
        <Route path="contato" element={<ContactPage />} />
        <Route path="providers/:id" element={<ProviderPublic />} />

        {/* perfil (protegido) */}
        <Route
          path="profile"
          element={
            <Protected>
              <ProfilePage />
            </Protected>
          }
        />
        {/* aceitar /app/profile também */}
        <Route path="app/profile" element={<Navigate to="/profile" replace />} />

        {/* área app (protegida) */}
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
              <ProviderServices />
            </Protected>
          }
        />
        <Route
  path="app/my-services"
  element={
    <Protected roles={["provider", "admin"]}>
      <ProviderServices />
    </Protected>
  }
/>

        {/* redirecionar /app para home */}
        <Route path="app" element={<Navigate to="/" replace />} />

        {/* 404 com layout */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* rotas fora do layout (sem Header/Footer) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
