// src/pages/FAQ.tsx
import { useState } from "react";

type Faq = { q: string; a: string };

const faqs: Faq[] = [
  {
    q: "Como funciona o agendamento de serviços?",
    a: "Você busca prestadores por categoria, localização ou nome. Depois de escolher o prestador, selecione data e horário disponíveis, preencha os detalhes do serviço e confirme o agendamento.",
  },
  {
    q: "Os prestadores são verificados?",
    a: "Sim. Fazemos verificação de identidade e checagens básicas antes de habilitar o prestador para atender.",
  },
  {
    q: "Como faço o pagamento?",
    a: "O pagamento é feito on-line, com pré-autorização (hold) e captura apenas após a conclusão do serviço.",
  },
  {
    q: "E se eu não ficar satisfeito com o serviço?",
    a: "Entre em contato com o suporte em até 48h. Avaliaremos o caso e poderemos providenciar ajustes, reembolso parcial ou total conforme a política.",
  },
  {
    q: "Como posso me tornar um prestador?",
    a: "Crie uma conta de prestador, complete o perfil e envie a documentação solicitada. Após a aprovação você já pode publicar ofertas.",
  },
  {
    q: "Qual a taxa cobrada dos prestadores?",
    a: "Planos mensais + taxa por transação. Consulte a página de Preços para os valores atualizados.",
  },
  {
    q: "Posso cancelar um agendamento?",
    a: "Sim. Clientes podem cancelar antes do início sem custo (dentro do prazo). Após o prazo, pode haver taxa. Prestadores devem seguir a política do app.",
  },
  {
    q: "Como funciona o chat entre cliente e prestador?",
    a: "Após criar um job, abrimos uma conversa vinculada ao serviço para alinhar detalhes e arquivos. As mensagens ficam registradas.",
  },
  {
    q: "Os prestadores têm seguro?",
    a: "Em alguns serviços oferecemos coberturas adicionais. Verifique a disponibilidade na sua região e categoria.",
  },
  {
    q: "Como avalio um prestador?",
    a: "Ao finalizar o serviço, você poderá dar uma nota e um comentário. Essas avaliações ajudam outros clientes.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="container py-10">
      {/* Título */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Perguntas Frequentes</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Encontre respostas para as dúvidas mais comuns sobre o LimpezaApp.
        </p>
      </div>

      {/* Lista de perguntas */}
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((item, i) => {
          const open = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <button
                className="w-full px-5 py-4 text-left flex items-start justify-between gap-4"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
              >
                <span className="font-medium">{item.q}</span>
                <span
                  className={`i-lucide-chevron-down shrink-0 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>

              <div
                className={`grid transition-all duration-200 ${
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 text-gray-600 dark:text-gray-300">
                    {item.a}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA final */}
      <div className="mx-auto max-w-3xl mt-10">
        <div className="card">
          <div className="card-body text-center">
            <h3 className="text-xl font-semibold mb-1">Não encontrou sua resposta?</h3>
            <p className="opacity-80 mb-4">
              Nossa equipe de suporte está pronta para ajudar você com qualquer dúvida.
            </p>
            <div className="flex items-center justify-center gap-3">
              <a
                href="mailto:suporte@limpezaapp.local"
                className="btn btn-solid"
              >
                Entrar em Contato
              </a>
              <a
                href="/ajuda"
                className="btn btn-outline"
                onClick={(e) => e.preventDefault()}
              >
                Central de Ajuda
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
