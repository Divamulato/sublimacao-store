import "./Dashboard.css";

export default function Dashboard({
  totalProdutos,
  totalPedidos,
  totalClientes,
  faturamento,
  estoqueBaixo,
  visitas
}) {

  const cards = [
    {
      titulo: "Produtos",
      valor: totalProdutos,
      icone: "📦"
    },
    {
      titulo: "Pedidos",
      valor: totalPedidos,
      icone: "🛒"
    },
    {
      titulo: "Clientes",
      valor: totalClientes,
      icone: "👥"
    },
    {
      titulo: "Faturamento",
      valor: `R$ ${Number(faturamento).toFixed(2)}`,
      icone: "💰"
    },
    {
      titulo: "Estoque Baixo",
      valor: estoqueBaixo,
      icone: "⚠️"
    },
    {
      titulo: "Visitas",
      valor: visitas,
      icone: "👁️"
    }
  ];

  return (

    <div className="dashboard">

      <h1>Painel Administrativo</h1>

      <p className="subtitulo">
        Bem-vindo ao gerenciamento da Diva Sublimação.
      </p>

      <div className="cardsDashboard">

        {cards.map((card) => (

          <div
            key={card.titulo}
            className="cardDashboard"
          >

            <div className="icone">

              {card.icone}

            </div>

            <div>

              <h3>{card.titulo}</h3>

              <strong>{card.valor}</strong>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}