import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { nome: "📊 Dashboard", rota: "/admin" },
    { nome: "📦 Produtos", rota: "/admin/produtos" },
    { nome: "🛒 Pedidos", rota: "/pedidos" },
    { nome: "👥 Clientes", rota: "/clientes" },
    { nome: "📈 Relatórios", rota: "/admin/relatorios" },
    { nome: "⚙ Configurações", rota: "/admin/configuracoes" },
  ];

  return (
    <aside className="sidebar">
      <h2>Diva Admin</h2>

      <nav>
        {menu.map((item) => (
          <Link
            key={item.rota}
            to={item.rota}
            className={
              location.pathname === item.rota
                ? "ativo"
                : ""
            }
          >
            {item.nome}
          </Link>
        ))}
      </nav>
    </aside>
  );
}