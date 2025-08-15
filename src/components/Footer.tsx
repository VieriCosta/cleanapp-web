export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200">
      <div className="container py-6 text-sm text-gray-500 flex flex-col md:flex-row gap-2 md:gap-0 md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} CleanApp. Todos os direitos reservados.</div>
        <div className="opacity-80">MVP · React + Vite + Tailwind</div>
      </div>
    </footer>
  );
}
