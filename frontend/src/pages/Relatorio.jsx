import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Relatorio.css";

const API = "https://sublimacao-store.onrender.com";

export default function Relatorio() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [periodo, setPeriodo] = useState("30");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // =========================================
  // CARREGAR DADOS
  // =========================================

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin-login", {
        replace: true,
      });

      return;
    }

    async function carregarDados() {
      try {
        // PRODUTOS

        const respostaProdutos = await fetch(
          `${API}/produtos`
        );

        if (!respostaProdutos.ok) {
          throw new Error(
            "Erro ao carregar produtos"
          );
        }

        const dadosProdutos =
          await respostaProdutos.json();

        // PEDIDOS

        const respostaPedidos = await fetch(
          `${API}/pedidos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (respostaPedidos.status === 401) {
          localStorage.removeItem(
            "adminToken"
          );

          localStorage.removeItem(
            "adminUsuario"
          );

          navigate("/admin-login", {
            replace: true,
          });

          return;
        }

        if (!respostaPedidos.ok) {
          throw new Error(
            "Erro ao carregar pedidos"
          );
        }

        const dadosPedidos =
          await respostaPedidos.json();

        setProdutos(
          Array.isArray(dadosProdutos)
            ? dadosProdutos
            : []
        );

        setPedidos(
          Array.isArray(dadosPedidos)
            ? dadosPedidos
            : []
        );
      } catch (error) {
        console.error(
          "Erro ao carregar relatório:",
          error
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [navigate]);

  // =========================================
  // FILTRO DE PERÍODO
  // =========================================

  function obterPedidosFiltrados() {
    const agora = new Date();

    let inicio = null;
    let fim = new Date(agora);

    // HOJE

    if (periodo === "hoje") {
      inicio = new Date(
        agora.getFullYear(),
        agora.getMonth(),
        agora.getDate()
      );

      fim = new Date(
        agora.getFullYear(),
        agora.getMonth(),
        agora.getDate(),
        23,
        59,
        59
      );
    }

    // 7 DIAS

    if (periodo === "7") {
      inicio = new Date(agora);

      inicio.setDate(
        agora.getDate() - 6
      );

      inicio.setHours(
        0,
        0,
        0,
        0
      );

      fim = new Date(agora);

      fim.setHours(
        23,
        59,
        59,
        999
      );
    }

    // 30 DIAS

    if (periodo === "30") {
      inicio = new Date(agora);

      inicio.setDate(
        agora.getDate() - 29
      );

      inicio.setHours(
        0,
        0,
        0,
        0
      );

      fim = new Date(agora);

      fim.setHours(
        23,
        59,
        59,
        999
      );
    }

    // ESTE MÊS

    if (periodo === "mes") {
      inicio = new Date(
        agora.getFullYear(),
        agora.getMonth(),
        1
      );

      fim = new Date(
        agora.getFullYear(),
        agora.getMonth() + 1,
        0,
        23,
        59,
        59
      );
    }

    // PERSONALIZADO

    if (
      periodo === "personalizado" &&
      dataInicio
    ) {
      inicio = new Date(
        `${dataInicio}T00:00:00`
      );
    }

    if (
      periodo === "personalizado" &&
      dataFim
    ) {
      fim = new Date(
        `${dataFim}T23:59:59`
      );
    }

    return pedidos.filter(
      (pedido) => {
        if (!pedido.createdAt) {
          return false;
        }

        const dataPedido = new Date(
          pedido.createdAt
        );

        if (
          inicio &&
          dataPedido < inicio
        ) {
          return false;
        }

        if (
          fim &&
          dataPedido > fim
        ) {
          return false;
        }

        return true;
      }
    );
  }

  const pedidosRelatorio =
    obterPedidosFiltrados();

  // =========================================
  // ESTATÍSTICAS
  // =========================================

  const totalProdutos =
    produtos.length;

  const totalPedidos =
    pedidosRelatorio.length;

  const totalEstoque =
    produtos.reduce(
      (total, produto) =>
        total +
        Number(
          produto.estoque || 0
        ),
      0
    );

  const faturamento =
    pedidosRelatorio.reduce(
      (total, pedido) =>
        total +
        Number(
          pedido.total ||
          pedido.valor ||
          0
        ),
      0
    );

  const ticketMedio =
    totalPedidos > 0
      ? faturamento / totalPedidos
      : 0;

  // =========================================
  // STATUS
  // =========================================

  const pedidosPendentes =
    pedidosRelatorio.filter(
      (pedido) =>
        pedido.status === "pendente"
    ).length;

  const pedidosPagos =
    pedidosRelatorio.filter(
      (pedido) =>
        pedido.status === "pago"
    ).length;

  const pedidosProducao =
    pedidosRelatorio.filter(
      (pedido) =>
        pedido.status === "producao"
    ).length;

  const pedidosEnviados =
    pedidosRelatorio.filter(
      (pedido) =>
        pedido.status === "enviado"
    ).length;

  const pedidosConcluidos =
    pedidosRelatorio.filter(
      (pedido) =>
        pedido.status === "concluido"
    ).length;

  const pedidosCancelados =
    pedidosRelatorio.filter(
      (pedido) =>
        pedido.status === "cancelado"
    ).length;

  // =========================================
  // ESTOQUE BAIXO
  // =========================================

  const produtosEstoqueBaixo =
    produtos.filter(
      (produto) =>
        Number(
          produto.estoque || 0
        ) <= 5
    );

  // =========================================
  // DATA DA GERAÇÃO
  // =========================================

  const dataGeracao =
    new Date().toLocaleString(
      "pt-BR"
    );

  // =========================================
  // TEXTO DO PERÍODO
  // =========================================

  function nomePeriodo() {
    if (periodo === "hoje") {
      return "Hoje";
    }

    if (periodo === "7") {
      return "Últimos 7 dias";
    }

    if (periodo === "30") {
      return "Últimos 30 dias";
    }

    if (periodo === "mes") {
      return "Este mês";
    }

    if (periodo === "personalizado") {
      if (
        dataInicio &&
        dataFim
      ) {
        return `${dataInicio} até ${dataFim}`;
      }

      if (dataInicio) {
        return `A partir de ${dataInicio}`;
      }

      if (dataFim) {
        return `Até ${dataFim}`;
      }

      return "Período personalizado";
    }

    return "Período selecionado";
  }

  // =========================================
  // IMPRIMIR
  // =========================================

  function imprimirRelatorio() {
    window.print();
  }

  // =========================================
  // CARREGANDO
  // =========================================

  if (carregando) {
    return (
      <div className="relatorio">
        <h1>
          Carregando relatório...
        </h1>
      </div>
    );
  }

  // =========================================
  // RETURN
  // =========================================

  return (
    <div className="relatorio">

      {/* =====================================
          ÁREA DE CONTROLES
      ====================================== */}

      <div className="acoes-relatorio">

        <button
          type="button"
          className="btn-imprimir"
          onClick={imprimirRelatorio}
        >
          🖨️ Imprimir / Salvar PDF
        </button>

        <button
          type="button"
          className="btn-voltar"
          onClick={() =>
            navigate("/admin")
          }
        >
          ← Voltar para o painel
        </button>

      </div>

      {/* =====================================
          DOCUMENTO
      ====================================== */}

      <div className="documento-relatorio">

        {/* CABEÇALHO */}

        <header className="cabecalho-impressao">

          <div>

            <h1>
              📊 Relatório Administrativo
            </h1>

            <h2>
              Diva Atelier de Sublimação
            </h2>

            <p>
              Período:{" "}
              <strong>
                {nomePeriodo()}
              </strong>
            </p>

          </div>

          <div className="info-relatorio">

            <span>
              Relatório gerado em:
            </span>

            <strong>
              {dataGeracao}
            </strong>

          </div>

        </header>

        {/* =================================
            FILTRO
        ================================== */}

        <section className="filtros-relatorio">

          <h2>
            📅 Período do relatório
          </h2>

          <div className="botoes-periodo">

            <button
              type="button"
              className={
                periodo === "hoje"
                  ? "periodo-ativo"
                  : ""
              }
              onClick={() =>
                setPeriodo("hoje")
              }
            >
              Hoje
            </button>

            <button
              type="button"
              className={
                periodo === "7"
                  ? "periodo-ativo"
                  : ""
              }
              onClick={() =>
                setPeriodo("7")
              }
            >
              7 dias
            </button>

            <button
              type="button"
              className={
                periodo === "30"
                  ? "periodo-ativo"
                  : ""
              }
              onClick={() =>
                setPeriodo("30")
              }
            >
              30 dias
            </button>

            <button
              type="button"
              className={
                periodo === "mes"
                  ? "periodo-ativo"
                  : ""
              }
              onClick={() =>
                setPeriodo("mes")
              }
            >
              Este mês
            </button>

            <button
              type="button"
              className={
                periodo ===
                "personalizado"
                  ? "periodo-ativo"
                  : ""
              }
              onClick={() =>
                setPeriodo(
                  "personalizado"
                )
              }
            >
              Personalizado
            </button>

          </div>

          {periodo ===
            "personalizado" && (

            <div className="datas-personalizadas">

              <div>

                <label>
                  Data inicial
                </label>

                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) =>
                    setDataInicio(
                      e.target.value
                    )
                  }
                />

              </div>

              <div>

                <label>
                  Data final
                </label>

                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) =>
                    setDataFim(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

          )}

        </section>

        {/* =================================
            RESUMO
        ================================== */}

        <section className="resumo-relatorio">

          <div className="card-relatorio">
            <span>📦 Produtos</span>
            <strong>
              {totalProdutos}
            </strong>
          </div>

          <div className="card-relatorio">
            <span>📋 Pedidos</span>
            <strong>
              {totalPedidos}
            </strong>
          </div>

          <div className="card-relatorio">
            <span>💰 Faturamento</span>
            <strong>
              R$ {faturamento.toFixed(2)}
            </strong>
          </div>

          <div className="card-relatorio">
            <span>📦 Estoque</span>
            <strong>
              {totalEstoque}
            </strong>
          </div>

          <div className="card-relatorio">
            <span>🎯 Ticket médio</span>
            <strong>
              R$ {ticketMedio.toFixed(2)}
            </strong>
          </div>

        </section>

        {/* =================================
            STATUS
        ================================== */}

        <section className="secao-relatorio">

          <h2>
            📋 Status dos pedidos
          </h2>

          <div className="status-relatorio">

            <div>
              <span>⏳ Pendentes</span>
              <strong>
                {pedidosPendentes}
              </strong>
            </div>

            <div>
              <span>💳 Pagos</span>
              <strong>
                {pedidosPagos}
              </strong>
            </div>

            <div>
              <span>🏭 Em produção</span>
              <strong>
                {pedidosProducao}
              </strong>
            </div>

            <div>
              <span>🚚 Enviados</span>
              <strong>
                {pedidosEnviados}
              </strong>
            </div>

            <div>
              <span>✅ Concluídos</span>
              <strong>
                {pedidosConcluidos}
              </strong>
            </div>

            <div>
              <span>❌ Cancelados</span>
              <strong>
                {pedidosCancelados}
              </strong>
            </div>

          </div>

        </section>

        {/* =================================
            ESTOQUE BAIXO
        ================================== */}

        <section className="secao-relatorio">

          <h2>
            ⚠️ Estoque baixo
          </h2>

          {produtosEstoqueBaixo.length ===
          0 ? (

            <p>
              Nenhum produto com estoque
              baixo.
            </p>

          ) : (

            <div className="tabela-relatorio">

              <div className="linha-cabecalho estoque-grid">

                <strong>
                  Produto
                </strong>

                <strong>
                  Estoque
                </strong>

                <strong>
                  Situação
                </strong>

              </div>

              {produtosEstoqueBaixo.map(
                (produto) => (

                  <div
                    className="linha-relatorio estoque-grid"
                    key={produto.id}
                  >

                    <span>
                      {produto.nome}
                    </span>

                    <span>
                      {produto.estoque}
                    </span>

                    <span>
                      ⚠️ Repor estoque
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* =================================
            PEDIDOS
        ================================== */}

        <section className="secao-relatorio pedidos-secao">

          <h2>
            🛒 Relatório de pedidos
          </h2>

          {pedidosRelatorio.length ===
          0 ? (

            <p>
              Nenhum pedido encontrado
              neste período.
            </p>

          ) : (

            <div className="tabela-relatorio">

              <div className="linha-cabecalho pedidos-grid">

                <strong>
                  Pedido
                </strong>

                <strong>
                  Cliente
                </strong>

                <strong>
                  Data
                </strong>

                <strong>
                  Status
                </strong>

                <strong>
                  Total
                </strong>

              </div>

              {pedidosRelatorio.map(
                (pedido) => (

                  <div
                    className="linha-relatorio pedidos-grid"
                    key={pedido.id}
                  >

                    <span>
                      #{pedido.id}
                    </span>

                    <span>
                      {pedido.cliente ||
                        "Não informado"}
                    </span>

                    <span>
                      {pedido.createdAt
                        ? new Date(
                            pedido.createdAt
                          ).toLocaleDateString(
                            "pt-BR"
                          )
                        : "-"}
                    </span>

                    <span>
                      {pedido.status ||
                        "pendente"}
                    </span>

                    <span>
                      R${" "}
                      {Number(
                        pedido.total ||
                        pedido.valor ||
                        0
                      ).toFixed(2)}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* =================================
            RODAPÉ
        ================================== */}

        <footer className="rodape-relatorio">

          <span>
            Diva Atelier de Sublimação
          </span>

          <span>
            Relatório administrativo
          </span>

        </footer>

      </div>

    </div>
  );
}