import { useMemo, useState } from "react";

type Tile = {
  title: string;
  bullets: string[];
  to?: string;
};

const guides: Tile[] = [
  {
    title: "Guias de Uso",
    bullets: ["Como agendar um serviço", "Gerenciar seu perfil", "Sistema de avaliações"],
    to: "/como-funciona",
  },
  {
    title: "Problemas Comuns",
    bullets: ["Problemas de pagamento", "Cancelamento de serviços", "Contato com prestador"],
    to: "/faq",
  },
  {
    title: "Suporte Técnico",
    bullets: ["App não carrega", "Problemas de login", "Notificações não funcionam"],
    to: "/ajuda",
  },
];

const populares = [
  { title: "Como cancelar um agendamento", to: "/faq#cancelamento" },
  { title: "Formas de pagamento aceitas", to: "/faq#pagamento" },
  { title: "Como avaliar um prestador", to: "/faq#avaliacao" },
  { title: "Política de reembolso", to: "/faq#reembolso" },
  { title: "Como alterar dados do perfil", to: "/profile" },
  { title: "Problemas com notificações", to: "/ajuda#notificacoes" },
];

export default function HelpCenter() {
  const [q, setQ] = useState("");

  const filteredGuides = useMemo(() => {
    if (!q.trim()) return guides;
    const s = q.toLowerCase();
    return guides
      .map((g) => ({
        ...g,
        bullets: g.bullets.filter((b) => b.toLowerCase().includes(s)),
      }))
      .filter((g) => g.title.toLowerCase().includes(s) || g.bullets.length > 0);
  }, [q]);

  const filteredPopulares = useMemo(() => {
    if (!q.trim()) return populares;
    const s = q.toLowerCase();
    return populares.filter((a) => a.title.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero */}
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Central de Ajuda</h1>
        <p className="opacity-80">
          Encontre respostas rápidas para suas dúvidas ou entre em contato conosco.
        </p>

        <div className="mt-6">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-3 pr-11 outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* 3 colunas */}
      <div className="grid gap-6 md:grid-cols-3">
        {filteredGuides.map((tile, i) => (
          <a
            key={i}
            href={tile.to}
            className="block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                {/* ícone simples */}
                {i === 0 && (
                  <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 19.5V6a2 2 0 012-2h9M8 6h9a2 2 0 012 2v11.5M8 6v13.5" />
                  </svg>
                )}
                {i === 1 && (
                  <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                )}
                {i === 2 && (
                  <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 16.92V21a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07A19.5 19.5 0 013.07 12.8 19.86 19.86 0 010 4.18 2 2 0 012 2h4.09a2 2 0 012 1.72c.12.9.3 1.77.54 2.6a2 2 0 01-.45 2.11L7 9a16 16 0 007 7l.57-.72a2 2 0 012.11-.45c.83.24 1.7.42 2.6.54A2 2 0 0122 16.92z" />
                  </svg>
                )}
              </div>
              <h3 className="font-semibold text-lg">{tile.title}</h3>
            </div>

            <ul className="space-y-2 text-sm opacity-80">
              {tile.bullets.map((b, j) => (
                <li key={j} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500/70" />
                  {b}
                </li>
              ))}
            </ul>
          </a>
        ))}
      </div>

      {/* Contato rápido */}
      <section className="mt-12 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Ainda precisa de ajuda?</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <a
            href="mailto:suporte@cleanapp.local"
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-6 flex flex-col items-center text-center hover:shadow-md transition"
          >
            <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-3">
              <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 4h16v16H4z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </div>
            <div className="font-medium">Email</div>
            <div className="text-sm opacity-70">Resposta em até 24 horas</div>
            <div className="mt-3 inline-flex px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">
              Enviar Email
            </div>
          </a>

          <a
            href="tel:+5511999999999"
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-6 flex flex-col items-center text-center hover:shadow-md transition"
          >
            <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-3">
              <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 16.92V21a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07A19.5 19.5 0 013.07 12.8 19.86 19.86 0 010 4.18 2 2 0 012 2h4.09a2 2 0 012 1.72c.12.9.3 1.77.54 2.6a2 2 0 01-.45 2.11L7 9a16 16 0 007 7l.57-.72a2 2 0 012.11-.45c.83.24 1.7.42 2.6.54A2 2 0 0122 16.92z" />
              </svg>
            </div>
            <div className="font-medium">Telefone</div>
            <div className="text-sm opacity-70">Seg a Sex, 8h às 18h</div>
            <div className="mt-3 inline-flex px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-sm">
              (11) 9999-9999
            </div>
          </a>
        </div>
      </section>

      {/* Artigos populares */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-center">Artigos Populares</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPopulares.map((a, i) => (
            <a
              key={i}
              href={a.to}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 px-5 py-4 hover:shadow-md transition"
            >
              {a.title}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
