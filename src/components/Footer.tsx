import { Link } from "react-router-dom";

function IconFacebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}
function IconInstagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5Zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5ZM18 6.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" />
    </svg>
  );
}
function IconTwitter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 5.92a8.22 8.22 0 0 1-2.36.65A4.11 4.11 0 0 0 21.4 4a8.2 8.2 0 0 1-2.6 1A4.1 4.1 0 0 0 12 8.1a4.4 4.4 0 0 0 .1.94A11.64 11.64 0 0 1 3 4.78 4.1 4.1 0 0 0 4.27 10a4.06 4.06 0 0 1-1.86-.51v.05A4.1 4.1 0 0 0 6.1 13a4.2 4.2 0 0 1-1.85.07A4.11 4.11 0 0 0 7.9 15a8.24 8.24 0 0 1-5.1 1.76A8.5 8.5 0 0 1 2 16.7a11.63 11.63 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68v-.53A8.35 8.35 0 0 0 22 5.92Z" />
    </svg>
  );
}

export default function Footer() {
  function handleNewsletter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "");
    if (!email) return;
    // mock
    alert(`Obrigado! Enviaremos novidades para: ${email}`);
    e.currentTarget.reset();
  }

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-xl font-semibold mb-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">C</span>
              <span>Clear<strong>App</strong></span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Conectando você aos melhores prestadores de serviços de limpeza.
              Qualidade, confiança e praticidade em um só lugar.
            </p>
            <div className="mt-4 flex items-center gap-4 text-gray-500 dark:text-gray-400">
              <a href="#" aria-label="facebook">
                <IconFacebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="instagram">
                <IconInstagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="twitter">
                <IconTwitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <div className="font-semibold mb-3">Links Rápidos</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/como-funciona" className="hover:underline">Como Funciona</Link></li>
              <li><Link to="/precos" className="hover:underline">Preços</Link></li>
              <li><Link to="/app/offers" className="hover:underline">Para Prestadores</Link></li>
              <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <div className="font-semibold mb-3">Suporte</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ajuda" className="hover:underline">Central de Ajuda</Link></li>
              <li><Link to="/contato" className="hover:underline">Contato</Link></li>
              <li><a className="hover:underline" href="#">Segurança</a></li>
              <li><a className="hover:underline" href="#">Termos de Uso</a></li>
              <li><a className="hover:underline" href="#">Privacidade</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <div className="font-semibold mb-3">Newsletter</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Receba ofertas especiais e novidades em primeira mão.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                name="email"
                type="email"
                required
                placeholder="Seu e-mail"
                className="input flex-1"
              />
              <button className="btn btn-solid">OK</button>
            </form>

            <div className="mt-4 text-sm space-y-2 text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <span>📞</span> <span>(11) 9999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span> <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500">
          © {new Date().getFullYear()} ClearApp. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
