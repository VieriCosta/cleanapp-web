import { Link } from "react-router-dom";

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card">
      <div className="card-body text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm opacity-80 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <div className="container py-10 lg:py-14 space-y-10">
      {/* Título */}
      <header className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
          Como Funciona o LimpezaApp
        </h1>
        <p className="mt-3 opacity-80">
          Conectamos você aos melhores prestadores de serviços de limpeza em
          poucos passos simples.
        </p>
      </header>

      {/* Passo a passo */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          icon={
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          }
          title="1. Busque o Serviço"
        >
          Navegue pelas categorias ou use a busca para encontrar o serviço de
          limpeza ideal.
        </Card>

        <Card
          icon={
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M4 11h16M7 15h.01M11 15h.01M15 15h.01M7 19h.01M11 19h.01M15 19h.01" />
            </svg>
          }
          title="2. Agende"
        >
          Escolha data, horário e prestador. Defina os detalhes do seu serviço.
        </Card>

        <Card
          icon={
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a10 10 0 11-20 0 10 10 0 0120 0z" />
            </svg>
          }
          title="3. Confirme"
        >
          Finalize o agendamento e receba confirmação do prestador.
        </Card>

        <Card
          icon={
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
          }
          title="4. Avalie"
        >
          Após o serviço, avalie o prestador para ajudar outros usuários.
        </Card>
      </section>

      {/* Por que escolher */}
      <section className="card">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-6">
            Por que escolher o LimpezaApp?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center px-4">
              <div className="mx-auto mb-3 h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12a5 5 0 100-10 5 5 0 000 10z" />
                  <path d="M12 14c-5.33 0-8 2.667-8 5.333V22h16v-2.667C20 16.667 17.33 14 12 14z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Prestadores Verificados</h3>
              <p className="text-sm opacity-80">
                Profissionais passam por verificação de background e qualificação.
              </p>
            </div>

            <div className="text-center px-4">
              <div className="mx-auto mb-3 h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v6m0-10h.01M7.5 21h9a2.5 2.5 0 002.5-2.5v-9a2.5 2.5 0 00-1.5-2.3l-6-2.7-6 2.7A2.5 2.5 0 004 9.5v9A2.5 2.5 0 006.5 21z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Pagamento Seguro</h3>
              <p className="text-sm opacity-80">
                Transações protegidas e várias formas de pagamento.
              </p>
            </div>

            <div className="text-center px-4">
              <div className="mx-auto mb-3 h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 15h.01M12 15h.01M16 15h.01M9 11h6" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Suporte 24/7</h3>
              <p className="text-sm opacity-80">
                Nossa equipe está disponível quando você precisar.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
