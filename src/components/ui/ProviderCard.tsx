// src/components/ui/ProviderCard.tsx
import { Offer } from "@/lib/api";

function moneyBRL(v: number | string | null | undefined) {
  const n =
    typeof v === "string"
      ? Number(v)
      : typeof v === "number"
      ? v
      : 0;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type Props = {
  offer: Offer;
  // opcionais para enriquecer o card caso tenha vindo no payload
  distanceKm?: number | null;
  rating?: number | null;
  ratingCount?: number | null;
  verified?: boolean;
  tags?: string[];
  onOpenProfile?: () => void;
  onMessage?: () => void;
};

export default function ProviderCard({
  offer,
  distanceKm = null,
  rating = null,
  ratingCount = null,
  verified = false,
  tags = [],
  onOpenProfile,
  onMessage,
}: Props) {
  const name = offer?.provider?.user?.name ?? "Prestador";
  const price = moneyBRL(offer?.priceBase);
  const category = offer?.title ?? "Serviço";

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4 flex flex-col gap-3">
      {/* Topo: avatar + nome + verificado + “coração” */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div>
            <div className="flex items-center gap-2">
              <div className="font-medium">{name}</div>
              {verified && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  Verificado
                </span>
              )}
            </div>
            <div className="text-sm opacity-70">{category}</div>
          </div>
        </div>

        <button
          type="button"
          className="h-8 w-8 rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
          title="Favoritar"
        >
          ♥
        </button>
      </div>

      {/* Métricas (rating, distância, preço/hora) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm opacity-80">
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span>
              {rating ? rating.toFixed(1) : "—"}
              {ratingCount ? ` (${ratingCount})` : ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span>{distanceKm ? `${distanceKm.toFixed(1)} km` : "—"}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold">{price}</div>
          <div className="text-xs opacity-60">por hora</div>
        </div>
      </div>

      {/* Tags rápidas */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-1 rounded-full border border-gray-300 dark:border-gray-600"
            >
              {t}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full border border-gray-300 dark:border-gray-600">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onOpenProfile}
          className="flex-1 rounded-xl bg-blue-600 text-white text-sm py-2 hover:bg-blue-700 transition"
        >
          Ver Perfil
        </button>
        <button
          type="button"
          onClick={onMessage}
          className="h-10 w-10 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          title="Enviar mensagem"
        >
          💬
        </button>
      </div>
    </div>
  );
}
