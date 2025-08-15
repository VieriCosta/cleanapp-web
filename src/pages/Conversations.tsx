import { useEffect, useRef, useState } from "react";
import api from "../lib/api";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import ChatBubble from "../components/chat/ChatBubble";
import { toast } from "sonner";
import { useAuth } from "../store/auth";
import { getSocket } from "../lib/socket";

type Conversation = {
  id: string;
  jobId: string;
  unreadCount?: number;
  lastMessageAt?: string;
  job?: any;
};

type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
};

export default function ConversationsPage() {
  const { user } = useAuth();
  const [list, setList] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msg, setMsg] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  function scrollToEnd(smooth = true) {
    endRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }

  async function loadList() {
    try {
      const r = await api.get("/conversations");
      const items: Conversation[] = r.data.items ?? r.data ?? [];
      setList(items);
      if (!activeId && items[0]?.id) setActiveId(items[0].id);
    } catch {
      toast.error("Falha ao carregar conversas");
    }
  }

  async function loadMessages(id: string) {
    try {
      const r = await api.get(`/conversations/${id}/messages`);
      const items: Message[] = r.data.items ?? r.data?.messages ?? r.data ?? [];
      setMessages(items);
      scrollToEnd(false);
      await api.post(`/conversations/${id}/read-all`).catch(() => {});
    } catch {
      toast.error("Falha ao carregar mensagens");
    }
  }

  // carrega lista ao abrir
  useEffect(() => { loadList(); }, []);

  // sempre que troca de conversa, carrega mensagens e entra na sala
  useEffect(() => {
    if (!activeId) return;

    loadMessages(activeId);
    const socket = getSocket();
    socket.emit("conversations:join", activeId);

    const onNew = (payload: { conversationId: string; message: Message }) => {
      if (payload.conversationId !== activeId) {
        // poderia incrementar unread na lista
        setList((prev) =>
          prev.map((c) =>
            c.id === payload.conversationId
              ? { ...c, unreadCount: (c.unreadCount ?? 0) + 1, lastMessageAt: payload.message.createdAt }
              : c
          )
        );
        return;
      }
      setMessages((m) => [...m, payload.message]);
      setList((prev) =>
        prev.map((c) =>
          c.id === payload.conversationId ? { ...c, lastMessageAt: payload.message.createdAt } : c
        )
      );
      scrollToEnd();
    };

    const onUpdated = (patch: { conversationId: string; unreadCount?: number; lastMessageAt?: string }) => {
      setList((prev) =>
        prev.map((c) => (c.id === patch.conversationId ? { ...c, ...patch } : c))
      );
    };

    socket.on("message:new", onNew);
    socket.on("conversation:updated", onUpdated);

    return () => {
      socket.off("message:new", onNew);
      socket.off("conversation:updated", onUpdated);
    };
  }, [activeId]);

  async function send() {
    if (!msg.trim() || !activeId) return;
    try {
      const r = await api.post(`/conversations/${activeId}/messages`, { text: msg.trim() });
      const message = r.data.message ?? r.data;
      setMsg("");
      setMessages((m) => [...m, message]);
      scrollToEnd();
    } catch {
      toast.error("Falha ao enviar");
    }
  }

  return (
    <div className="grid gap-6">
      <h2 className="section-title">Conversas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lista */}
        <Card className="md:col-span-1">
          <CardHeader><div className="font-medium">Minhas conversas</div></CardHeader>
          <CardContent className="flex flex-col gap-2">
            {list.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`text-left rounded-xl px-3 py-2 border ${
                  activeId === c.id
                    ? "border-gray-900 dark:border-white bg-gray-100 dark:bg-gray-800"
                    : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <div className="text-sm font-medium">Job: {c.jobId}</div>
                <div className="text-xs opacity-70">
                  {c.lastMessageAt ? `Última: ${new Date(c.lastMessageAt).toLocaleString()}` : "—"}
                </div>
                {c.unreadCount ? (
                  <div className="mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                    {c.unreadCount} nova(s)
                  </div>
                ) : null}
              </button>
            ))}
            {list.length === 0 && <div className="text-sm text-gray-500">Sem conversas.</div>}
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="md:col-span-2">
          <CardHeader><div className="font-medium">Chat</div></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="min-h-[50vh] max-h-[60vh] overflow-y-auto flex flex-col gap-2 pr-1">
              {messages.map((m) => (
                <ChatBubble key={m.id} text={m.text} date={m.createdAt} mine={m.senderId === user?.id} />
              ))}
              <div ref={endRef} />
              {messages.length === 0 && (
                <div className="text-sm text-gray-500">Selecione uma conversa à esquerda.</div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <Button onClick={send}>Enviar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
