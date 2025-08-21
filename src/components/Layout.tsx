import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import ThemeToggle from "@/theme/ThemeToggle";
import Footer from "@/components/Footer";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="font-semibold text-lg tracking-tight">
            <span className="text-gray-900 dark:text-white">clean</span>
            <span className="text-blue-600">app</span>
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink to="/" end className={({isActive}) => `px-3 py-2 rounded-xl text-sm ${isActive?'bg-blue-600 text-white':'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>Home</NavLink>
            <NavLink to="/app/offers" className={({isActive}) => `px-3 py-2 rounded-xl text-sm ${isActive?'bg-blue-600 text-white':'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>Ofertas</NavLink>
            <NavLink to="/app/conversations" className={({isActive}) => `px-3 py-2 rounded-xl text-sm ${isActive?'bg-blue-600 text-white':'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>Conversas</NavLink>

            {/* Só prestador/admin enxerga "Meus serviços" */}
            {(user?.role === "provider" || user?.role === "admin") && (
              <NavLink
                to="/app/my-services"
                className={({isActive}) =>
                  `px-3 py-2 rounded-xl text-sm ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`
                }>
                Meus serviços
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <>
                <Link
                  to="/app/profile"
                  title="Meu perfil"
                  aria-label="Ir para o meu perfil"
                  className="inline-flex h-6 w-6 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-blue-400 transition"
                >
                  <img src={user.photoUrl ?? "/avatar-fallback.png"} alt="Foto de perfil" className="h-full w-full object-cover" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/register"
                className="px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
