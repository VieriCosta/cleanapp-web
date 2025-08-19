import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/store/auth";

export default function Layout() {
  const { user, logout } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    "px-3 py-2 rounded-xl transition " +
    (isActive
      ? "bg-blue-600 text-white"
      : "hover:bg-gray-100 dark:hover:bg-gray-800");

  return (
    <>
      <header className="border-b dark:border-gray-800">
        <div className="container h-14 flex items-center justify-between">
          {/* logo */}
          <Link to="/" className="font-semibold">
            clean<span className="text-blue-600">app</span>
          </Link>

          {/* NAV */}
          <nav className="flex gap-2">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>

            <NavLink to="/app/offers" className={navClass}>
              Ofertas
            </NavLink>

            {/* Cliente vê "Meus Jobs" */}
            {user?.role === "customer" && (
              <NavLink to="/app/jobs" className={navClass}>
                Meus Jobs
              </NavLink>
            )}

            <NavLink to="/app/conversations" className={navClass}>
              Conversas
            </NavLink>

            {/* Prestador vê "Prestador" */}
            {(user?.role === "provider" || user?.role === "admin") && (
              <NavLink to="/app/provider" className={navClass}>
                Prestador
              </NavLink>
            )}

            <NavLink to="/como-funciona" className={navClass}>
              Como Funciona
            </NavLink>
            <NavLink to="/precos" className={navClass}>
              Preços
            </NavLink>
          </nav>

          {/* Perfil / Ações à direita (exemplo simples) */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/profile" className="btn btn-outline">
                  {user.name ?? "Meu Perfil"}
                </Link>
                <button onClick={logout} className="btn btn-outline">
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-solid">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}
