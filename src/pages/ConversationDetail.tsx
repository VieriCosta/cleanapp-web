import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getConversation,
  listMessages,
  sendMessage,
  markAllRead,
} from "@/lib/api";

type Message = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
};

export default function ConversationDetail() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        await getConversation(id);
        const m = await listMessages(id, { page: 1, pageSize: 50 });
        setMessages(m.items ?? []);
        await markAllRead(id);
      } catch (e: any) {
        setError(e?.message ?? "Erro ao carregar conversa");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleSend() {
    if (!id || !text.trim()) return;
    const msg = await sendMessage(id, text.trim());
    setMessages((prev) => [...prev, msg.message]);
    setText("");
  }

  if (loading) return <div className="card p-6">Carregando…</div>;
  if (error) return <div className="card p-6 text-red-600">Erro: {error}</div>;

  return (
    <div className="card p-4 flex flex-col gap-4">
      <div className="max-h-[60vh] overflow-auto space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3">
            <div className="text-sm opacity-70">{new Date(m.createdAt).toLocaleString()}</div>
            <div>{m.content}</div>
          </div>
        ))}
        {messages.length === 0 && <div>Sem mensagens.</div>}
      </div>

      <div className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Escreva uma mensagem…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="btn btn-solid" onClick={handleSend}>
          Enviar
        </button>
      </div>
    </div>
  );
}
