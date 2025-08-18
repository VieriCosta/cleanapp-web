import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getConversation, listMessages, sendMessage, markAllRead } from "@/lib/api";
import { useAuth } from "@/store/auth";

type Message = { id: string; content: string; senderId: string; createdAt?: string };

export default function ConversationDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [convTitle, setConvTitle] = useState<string>("Conversa");
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const conv = await getConversation(id);
      // tenta ler um nome amigável no objeto retornado
      const title =
        conv?.partner?.name ||
        conv?.participants?.find((p: any) => p.userId !== user?.id)?.user?.name ||
        "Conversa";
      setConvTitle(title);

      const data = await listMessages(id, { page: 1, pageSize: 100 });
      const items = Array.isArray(data) ? data : data?.items ?? [];
      setMsgs(items);

      // marca lidas
      await markAllRead(id);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => listRef.current?.scrollTo({ top: 999999 }));
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !text.trim()) return;
    const payload = text.trim();
    setText("");
    try {
      const { message } = await sendMessage(id, payload);
      setMsgs((prev) => [...prev, message ?? { id: Math.random().toString(), content: payload, senderId: user?.id! }]);
      requestAnimationFrame(() => listRef.current?.scrollTo({ top: 999999, behavior: "smooth" }));
    } catch {
      // opcional: mostrar toast
    }
  }

  return (
    <div className="container py-8">
      <h1 className="section-title mb-4">{convTitle}</h1>

      <div className="card">
        <div ref={listRef} className="card-body max-h-[60vh] overflow-auto space-y-2">
          {loading ? (
            <div className="opacity-70">Carregando…</div>
          ) : msgs.length === 0 ? (
            <div className="opacity-70">Nenhuma mensagem ainda.</div>
          ) : (
            msgs.map((m) => {
              const mine = m.senderId === user?.id;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[70%] ${
                      mine
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-gray-100 dark:bg-gray-700 dark:text-gray-100 rounded-bl-sm"
                    }`}
                  >
                    <div className="text-sm leading-relaxed">{m.content}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={onSend} className="border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2">
          <input
            className="input flex-1"
            placeholder="Digite sua mensagem…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn btn-solid" type="submit" disabled={!text.trim()}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
