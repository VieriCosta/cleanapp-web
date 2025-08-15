import { Link, NavLink } from "react-router-dom";
import Button from "./ui/Button";
import { useAuth } from "../store/auth";
import { Handshake, Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const LinkCls = ({ to, children }: any) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"}`
      }
      onClick={() => setOpen(false)}
    >
      {children}
    </NavLink>
  );

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Handshake className="w-5 h-5 text-brand" />
          CleanApp
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2 ml-4">
  <LinkCls to="/login">Login</LinkCls>
  <LinkCls to="/offers">Ofertas</LinkCls>
  <LinkCls to="/conversations">Conversas</LinkCls>
  {user?.role === "customer" && <LinkCls to="/customer">Cliente</LinkCls>}
  {user?.role === "provider" && <LinkCls to="/provider">Prestador</LinkCls>}
</nav>

        <div className="ml-auto hidden md:flex items-center gap-2">
  <ThemeToggle />
  {user && (
    <Button onClick={logout} variant="outline">
      Sair ({user.name ?? user.email})
    </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="ml-auto md:hidden btn btn-ghost" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
  <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    <div className="container py-3 flex flex-col gap-2">
      <ThemeToggle />
            <LinkCls to="/login">Login</LinkCls>
            <LinkCls to="/offers">Ofertas</LinkCls>
<LinkCls to="/conversations">Conversas</LinkCls>
            {user?.role === "customer" && <LinkCls to="/customer">Cliente</LinkCls>}
            {user?.role === "provider" && <LinkCls to="/provider">Prestador</LinkCls>}
            {user && <Button onClick={logout} variant="outline">Sair</Button>}
          </div>
        </div>
      )}
    </header>
  );
}
