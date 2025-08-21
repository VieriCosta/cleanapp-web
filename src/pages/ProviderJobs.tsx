import { useEffect, useState } from "react";
import { listMyOffers, deleteMyOffer, MyOffer } from "@/lib/api";

export default function ProviderDashboard() {
  const [items, setItems] = useState<MyOffer[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const res = await listMyOffers();
      setItems(res.items);
    } catch (e) {
      console.error("Erro ao carregar minhas ofertas", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta oferta?")) return;
    try {
      await deleteMyOffer(id);
      setItems((prev) => prev.filter((o) => o.id !== id));
    } catch (e: any) {
      if (e?.response?.status === 403) {
        alert("Você não tem permissão para excluir esta oferta.");
      } else if (e?.response?.status === 404) {
        alert("Oferta não encontrada (ou não é sua).");
      } else {
        alert("Erro ao excluir. Tente novamente.");
      }
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Meus serviços</h1>
        {/* (Opcional) botão de criação futura */}
        {/* <button className="btn btn-solid" onClick={() => ...}>Novo serviço</button> */}
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <div>Carregando...</div>}
        {!loading && items.length === 0 && (
          <div className="opacity-70">Você ainda não possui serviços cadastrados.</div>
        )}

        {!loading &&
          items.map((o) => (
            <div key={o.id} className="card">
              <div className="card-body">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{o.title}</div>
                    {o.description && (
                      <div className="text-sm opacity-70 mt-1 line-clamp-2">{o.description}</div>
                    )}
                    <div className="mt-2 text-sm">
                      <span className="font-semibold">
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(o.priceBase))}
                      </span>{" "}
                      <span className="opacity-70">/ {o.unit}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <span
                      className={`inline-block text-xs px-2 py-1 rounded ${
                        o.active
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {o.active ? "Ativa" : "Inativa"}
                    </span>

                    <div className="flex gap-2 justify-end">
                      {/* (Opcional) Editar futuro */}
                      {/* <button className="px-3 py-1.5 rounded-xl border text-sm">Editar</button> */}
                      <button
                        onClick={() => handleDelete(o.id)}
                        className="px-3 py-1.5 rounded-xl border text-sm bg-red-600 text-white hover:bg-red-700"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs opacity-60">
                  Criada em {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
