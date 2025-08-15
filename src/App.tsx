import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import OffersPage from "./pages/Offers";
import ConversationsPage from "./pages/Conversations";
import { Protected } from "./components/Protected";
import Layout from "./components/Layout";
import AddressesPage from "./pages/Addresses";
import Home from "./pages/Home";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/offers"
          element={
            <Protected roles={["customer","provider"]}>
              <OffersPage />
            </Protected>
          }
        />
        <Route
          path="/conversations"
          element={
            <Protected roles={["customer","provider"]}>
              <ConversationsPage />
            </Protected>
          }
        />

        <Route
          path="/customer"
          element={
            <Protected roles={["customer"]}>
              <CustomerDashboard />
            </Protected>
          }
        />
        <Route
          path="/provider"
          element={
            <Protected roles={["provider"]}>
              <ProviderDashboard />
            </Protected>
          }
        />
        <Route
          path="/addresses"
          element={
            <Protected roles={["customer","provider","admin"]}>
              <AddressesPage />
            </Protected>
          }
        />
        <Route path="*" element={<div className="p-8">Página não encontrada</div>} />
      </Routes>
    </Layout>
  );
}
