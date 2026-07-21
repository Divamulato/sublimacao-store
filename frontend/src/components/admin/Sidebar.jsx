import "./Sidebar.css";

export default function Sidebar({ tela, setTela, sairAdmin }) {
  const menus = [
    { id: "dashboard", titulo: "🏠 Dashboard" },
    { id: "produtos", titulo: "📦 Produtos" },
    { id: "pedidos", titulo: "🛒 Pedidos" },
    { id: "clientes", titulo: "👥 Clientes" },
    { id: "relatorios", titulo: "📊 Relatórios" },
    { id: "configuracoes", titulo: "⚙ Configurações" },
  ];

  return (
    <aside className="sidebar">

      <h2 className="logoAdmin">
        Diva
        <span>Sublimação</span>
      </h2>

      <nav>

        {menus.map((menu) => (

          <button
            key={menu.id}
            className={tela === menu.id ? "ativo" : ""}
            onClick={() => setTela(menu.id)}
          >
            {menu.titulo}
          </button>

        ))}

      </nav>

      <button
        className="btnSair"
        onClick={sairAdmin}
      >
        🚪 Sair
      </button>

    </aside>
  );
}