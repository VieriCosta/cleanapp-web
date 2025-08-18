export default function PricingPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Planos e Preços
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cliente - grátis */}
        <div className="rounded-2xl border p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold mb-2">Cliente</div>
          <div className="text-3xl font-extrabold mb-4">Grátis</div>
          <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
            <li>Buscar prestadores</li>
            <li>Agendar serviços</li>
            <li>Chat com prestadores</li>
            <li>Avaliações</li>
          </ul>
          <div className="mt-6">
            <a href="/register" className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
              Começar Agora
            </a>
          </div>
        </div>

        {/* Prestador Básico */}
        <div className="rounded-2xl border p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold mb-2">Prestador Básico</div>
          <div className="text-3xl font-extrabold mb-1">R$ 19,90</div>
          <div className="text-xs text-gray-500 mb-4">/mês</div>
          <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
            <li>Perfil verificado</li>
            <li>Até 10 agendamentos/mês</li>
            <li>Chat com clientes</li>
          </ul>
          <div className="mt-6">
            <a href="/register" className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
              Assinar Plano
            </a>
          </div>
        </div>

        {/* Prestador Pro */}
        <div className="rounded-2xl border-2 border-blue-500 p-6 bg-white dark:bg-gray-800">
          <div className="inline-block mb-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Mais Popular</div>
          <div className="text-lg font-semibold mb-2">Prestador Pro</div>
          <div className="text-3xl font-extrabold mb-1">R$ 39,90</div>
          <div className="text-xs text-gray-500 mb-4">/mês</div>
          <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
            <li>Perfil destacado</li>
            <li>Agendamentos ilimitados</li>
            <li>Suporte prioritário</li>
          </ul>
          <div className="mt-6">
            <a href="/register" className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
              Assinar Plano
            </a>
          </div>
        </div>
      </div>

      {/* FAQ resumido */}
      <div className="mt-10 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Perguntas Frequentes sobre Preços
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
          <div>
            <div className="font-medium">Como funciona a cobrança?</div>
            <p className="text-sm">Para clientes é gratuito. Prestadores pagam mensalidade e taxa por transação.</p>
          </div>
          <div>
            <div className="font-medium">Posso cancelar a qualquer momento?</div>
            <p className="text-sm">Sim, sem multas. Cancelamento imediato.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
