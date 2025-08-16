import { Link } from "react-router-dom";

function IconFB(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12a10 10 0 1 0-11.563 9.9v-7h-2.5v-2.9h2.5V9.4c0-2.46 1.468-3.82 3.714-3.82 1.076 0 2.202.192 2.202.192v2.42h-1.24c-1.222 0-1.604.76-1.604 1.54v1.85h2.73l-.436 2.9h-2.294v7A10 10 0 0 0 22 12Z" />
    </svg>
  );
}
function IconIG(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.8A4.2 4.2 0 1 0 16.2 12 4.2 4.2 0 0 0 12 7.8Zm0 6.9A2.7 2.7 0 1 1 14.7 12 2.7 2.7 0 0 1 12 14.7Zm5.1-8.3a1.2 1.2 0 1 0 1.2-1.2 1.2 1.2 0 0 0-1.2 1.2Z" />
    </svg>
  );
}
function IconTW(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.9 7.2c.01.18.01.36.01.54 0 5.52-4.2 11.88-11.88 11.88A11.8 11.8 0 0 1 3 18.3c.3.03.6.04.9.04a8.36 8.36 0 0 0 5.18-1.78 4.18 4.18 0 0 1-3.9-2.9c.26.05.53.08.81.08.39 0 .77-.05 1.12-.15A4.17 4.17 0 0 1 4.2 9.7v-.05c.57.32 1.22.51 1.92.54A4.18 4.18 0 0 1 5.1 5.2a11.85 11.85 0 0 0 8.6 4.36 4.72 4.72 0 0 1-.1-.96 4.18 4.18 0 0 1 7.23-2.86 8.28 8.28 0 0 0 2.65-1.01 4.2 4.2 0 0 1-1.84 2.31 8.36 8.36 0 0 0 2.4-.66 9 9 0 0 1-2.05 2.14Z" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const onNewsletter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    if (email) alert(`Valeu! Vamos te avisar em: ${email}`);
    e.currentTarget.reset();
  };

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur">
      <div className="container py-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca + descrição */}
          <div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-blue-600 text-white grid place-items-center font-bold">L</div>
              <div className="text-lg font-semibold">LimpezaApp</div>
            </div>
            <p className="mt-4 text-sm opacity-80 max-w-xs">
              Conectando você aos melhores prestadores de serviços de limpeza. Qualidade,
              confiança e praticidade em um só lugar.
            </p>

            <div className="mt-4 flex items-center gap-4 text-gray-600 dark:text-gray-300">
              <a href="#" aria-label="Facebook" className="hover:text-blue-600">
                <IconFB className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-pink-500">
                <IconIG className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-sky-500">
                <IconTW className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links rápidos */}
          <nav aria-label="Links Rápidos">
            <h4 className="text-sm font-semibold tracking-wide uppercase text-gray-500 dark:text-gray-400">
              Links Rápidos
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/como-funciona" className="hover:text-blue-600">Como Funciona</Link></li>
              <li><a href="#" className="hover:text-blue-600">Para Prestadores</a></li>
              <li><a href="#" className="hover:text-blue-600">Preços</a></li>
              <li><a href="#" className="hover:text-blue-600">FAQ</a></li>
              <li><a href="#" className="hover:text-blue-600">Blog</a></li>
            </ul>
          </nav>

          {/* Suporte */}
          <nav aria-label="Suporte">
            <h4 className="text-sm font-semibold tracking-wide uppercase text-gray-500 dark:text-gray-400">
              Suporte
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-600">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-blue-600">Contato</a></li>
              <li><a href="#" className="hover:text-blue-600">Segurança</a></li>
              <li><a href="#" className="hover:text-blue-600">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-blue-600">Privacidade</a></li>
            </ul>
          </nav>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide uppercase text-gray-500 dark:text-gray-400">
              Newsletter
            </h4>
            <p className="mt-4 text-sm opacity-80">
              Receba ofertas especiais e novidades em primeira mão.
            </p>

            <form onSubmit={onNewsletter} className="mt-3 flex">
              <input
                type="email"
                name="email"
                required
                placeholder="Seu e-mail"
                className="input rounded-r-none"
              />
              <button
                type="submit"
                className="btn btn-solid rounded-l-none"
                aria-label="Assinar newsletter"
              >
                ✉️
              </button>
            </form>

            <div className="mt-4 space-y-2 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <span>📞</span> <span>(11) 9999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span> <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha / Copyright */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-sm opacity-70">
          © {year} LimpezaApp. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
