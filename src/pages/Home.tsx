// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProviderCard from "@/components/ui/ProviderCard";
import { listOffers, Offer } from "@/lib/api";

type OffersResp = {
  total: number;
  page: number;
  pageSize: number;
  items: Offer[];
};

export default function Home() {
  const navigate = useNavigate();

  const [offers, setOffers] = useState<OffersResp>({
    total: 0,
    page: 1,
    pageSize: 6,
    items: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await listOffers({ page: 1, pageSize: 6 });
        setOffers(data);
      } catch (e: any) {
        setErr(e?.response?.data?.message || e?.message || "Falha ao carregar ofertas");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="pb-16">
      {/* HERO */}
      <section className="w-full bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-900 dark:to-gray-900/60 border-b border-gray-200/60 dark:border-gray-800">
        <div className="container py-10 md:py-14">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Texto à esquerda */}
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
                Limpeza <span className="text-blue-600">profissional</span> na palma da sua mão
              </h1>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                Encontre os melhores prestadores de serviços de limpeza da sua região.
                Qualidade garantida, preços justos e avaliações reais.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/app/offers")}
                  className="btn btn-solid"
                >
                  Encontrar Prestadores
                </button>
                <button
                  onClick={() => navigate("/como-funciona")}
                  className="btn btn-outline"
                >
                  Como Funciona
                </button>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="text-xl font-semibold">1000+</div>
                  <div className="opacity-70">Prestadores</div>
                </div>
                <div>
                  <div className="text-xl font-semibold">50k+</div>
                  <div className="opacity-70">Serviços</div>
                </div>
                <div>
                  <div className="text-xl font-semibold">4.8</div>
                  <div className="opacity-70">Avaliação</div>
                </div>
              </div>
            </div>

            {/* Imagem à direita (veio do /public) */}
            <div className="relative">
              <img
                src="/imageHome.jpg"
                alt="Ambiente limpo e organizado"
                className="w-full rounded-2xl shadow-md object-cover"
              />
              {/* badge flutuante (decorativo) */}
              <div className="absolute -bottom-4 left-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 shadow">
                <div className="text-sm font-medium">Maria Silva</div>
                <div className="text-xs opacity-70">Limpeza Completa • Agendado para hoje</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIPOS DE SERVIÇO (chips estáticos) */}
      <section className="container py-10">
        <h2 className="section-title mb-4">Tipos de Serviço</h2>
        <p className="opacity-70 mb-6">
          Escolha o tipo de limpeza que você precisa e encontre os melhores profissionais.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            "Residencial",
            "Comercial",
            "Veículos",
            "Lavanderia",
            "Pesada",
            "Urgente",
          ].map((label) => (
            <button
              key={label}
              type="button"
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-center hover:shadow-sm transition"
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* PRESTADORES DISPONÍVEIS (cards vindos da API) */}
      <section className="container">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Prestadores disponíveis</h2>
          <button
            type="button"
            onClick={() => navigate("/providers")}
            className="text-sm text-blue-600 hover:underline"
          >
            Ver todas as ofertas
          </button>
        </div>

        {err && (
          <div className="rounded-2xl border border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-300 mb-6">
            {err}
          </div>
        )}

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 animate-pulse h-44"
              />
            ))}
          </div>
        )}

        {!loading && !err && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.items.map((o) => {
                // tenta extrair um id público de prestador do retorno da oferta
                const providerId =
                  (o as any).providerProfileId ??
                  (o as any).providerId ??
                  (o as any).provider?.id ??
                  null;

                return (
                  <ProviderCard
                    key={o.id}
                    offer={o}
                    onOpenProfile={() => {
                      if (providerId) {
                        navigate(`/providers/${providerId}`);
                      } else {
                        // fallback se a API não enviar o id do prestador
                        navigate(`/profile?offer=${o.id}`);
                      }
                    }}
                    onMessage={() => navigate(`/app/conversations`)}
                  />
                );
              })}
            </div>

            {offers.items.length === 0 && (
              <div className="opacity-70">Nenhum prestador encontrado.</div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
