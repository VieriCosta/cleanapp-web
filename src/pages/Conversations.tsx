import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listConversations } from "@/lib/api";
import { useAuth } from "@/store/auth";

type AnyObj = Record<string, any>;
type Conversation = {
  id: string;
  jobId?: string | null;
  lastMessageAt?: string | null;
  unreadCount?: number;
  // dependendo do seu service, pode vir como "partner" ou "participants"
  partner?: { id?: string; name?: string | null; avatarUrl?: string | null } | null;
  participants?: Array<{ userId?: string; user?: { name?: string | null; avatarUrl?: string | null } }>;
  lastMessage?: { content?: string | null; createdAt?: string };
};

function normalizeItems(data: any): Conversation[] {
  if (Array.isArray(data)) return data as Conversation[];
  if (data?.items && Array.isArray(data.items)) return data.items as Conversation[];
  return [];
}

function fmtTime(iso?: string | null) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return "";
  }
}

export default function ConversationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const data = await listConversations({ page: 1, pageSize: 20 });
      setItems(normalizeItems(data));
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Falha ao carregar conversas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function getPartnerName(conv: Conversation) {
    // tentar vários formatos (partner ou participants)
    if (conv.partner?.name) return conv.partner.name;
    const p = conv.participants?.find((pp) => pp.userId && pp.userId !== user?.id);
    if (p?.user?.name) return p.user.name;
    return "Participante";
  }

  function getLastPreview(conv: Conversation) {
    return conv.lastMessage?.content || "Abrir conversa";
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="card">
          <div className="card-body">Carregando conversas…</div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container py-8">
        <div className="card border-red-300">
          <div className="card-body">
            <div className="text-red-600 font-medium mb-2">Algo deu errado</div>
            <div className="mb-4 opacity-80 text-sm">{err}</div>
            <button className="btn btn-solid" onClick={load}>Tentar novamente</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="section-title mb-4">Conversas</h1>

      {items.length === 0 ? (
        <div className="card">
          <div className="card-body opacity-70">Você ainda não possui conversas.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <Link
              to={`/app/conversations/${c.id}`}
              key={c.id}
              className="block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium truncate">{getPartnerName(c)}</div>
                  <div className="text-sm opacity-70 truncate">{getLastPreview(c)}</div>
                </div>

                <div className="text-right">
                  {c.unreadCount ? (
                    <span className="inline-flex items-center justify-center min-w-6 h-6 text-xs font-semibold rounded-full bg-blue-600 text-white">
                      {c.unreadCount}
                    </span>
                  ) : (
                    <span className="text-xs opacity-60">{fmtTime(c.lastMessageAt)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
