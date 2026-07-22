import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const API = "http://localhost:3000";

export default function Admin() {
  const navigate = useNavigate();

  // ESTADOS
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [visitas, setVisitas] = useState(0);

  // CADASTRO
  const [imagem, setImagem] = useState(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");

  // EDIÇÃO
  const [editando, setEditando] = useState(null);
  const [nomeEdit, setNomeEdit] = useState("");
  const [descricaoEdit, setDescricaoEdit] = useState("");
  const [precoEdit, setPrecoEdit] = useState("");
  const [estoqueEdit, setEstoqueEdit] = useState("");
  const [imagemAtual, setImagemAtual] = useState("");

  // BUSCAS
  const [buscaProduto, setBuscaProduto] = useState("");
  const [buscaCliente, setBuscaCliente] = useState("");

  // ==============================
  // CARREGAR PRODUTOS
  // ==============================

  async function carregarProdutos() {
    try {
      const resposta = await fetch(`${API}/produtos`);

      if (!resposta.ok) {
        throw new Error("Erro ao buscar produtos");
      }

      const dados = await resposta.json();

      setProdutos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro produtos:", error);
    }
  }

  // ==============================
  // CARREGAR PEDIDOS
  // ==============================

  async function carregarPedidos() {
    try {
      const resposta = await fetch(`${API}/pedidos`);

      if (!resposta.ok) {
        throw new Error("Erro ao buscar pedidos");
      }

      const dados = await resposta.json();

      setPedidos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro pedidos:", error);
    }
  }

  // ==============================
  // CARREGAR VISITAS
  // ==============================

  async function carregarVisitas() {
    try {
      const resposta = await fetch(`${API}/visitas`);

      if (!resposta.ok) {
        throw new Error("Erro ao buscar visitas");
      }

      const dados = await resposta.json();

      setVisitas(Number(dados.total || 0));
    } catch (error) {
      console.error("Erro visitas:", error);
    }
  }

  // ==============================
  // CARREGAR DADOS
  // ==============================

  useEffect(() => {
    carregarProdutos();
    carregarPedidos();
    carregarVisitas();
  }, []);

  // ==============================
  // UPLOAD DE IMAGEM
  // ==============================

  async function enviarImagem(arquivo) {
    if (!arquivo) {
      return null;
    }

    const formData = new FormData();

    formData.append("imagem", arquivo);

    try {
      const resposta = await fetch(`${API}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!resposta.ok) {
        throw new Error("Erro no upload da imagem");
      }

      const dados = await resposta.json();

      return dados.url || null;
    } catch (error) {
      console.error("Erro upload:", error);

      alert("Erro ao enviar imagem.");

      return null;
    }
  }

  // ==============================
  // CRIAR PRODUTO
  // ==============================

 async function criarProduto(e) {
e.preventDefault();

try {
let urlImagem = null;

// Envia a imagem selecionada para o Cloudinary
if (imagem) {
  urlImagem = await enviarImagem(imagem);
}

const resposta = await fetch(`${API}/produtos`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    nome: nome,
    descricao: descricao,
    preco: Number(preco),
    estoque: Number(estoque),
    imagem: urlImagem,
  }),
});

if (!resposta.ok) {
  const erro = await resposta.json();

  throw new Error(
    erro.error || "Erro ao cadastrar produto"
  );
}

const novoProduto = await resposta.json();

setProdutos((produtosAtuais) => [
  ...produtosAtuais,
  novoProduto,
]);

// Limpar formulário
setNome("");
setDescricao("");
setPreco("");
setEstoque("");
setImagem(null);

// Limpar input de arquivo
const inputImagem = document.getElementById(
  "imagem-produto"
);

if (inputImagem) {
  inputImagem.value = "";
}

alert("Produto criado com sucesso!");

} catch (error) {
console.error(
"Erro ao criar produto:",
error
);

alert(
  error.message ||
  "Erro ao cadastrar produto"
);

}
}
  // ==============================
  // ABRIR EDIÇÃO
  // ==============================

  function abrirEdicao(produto) {
    setEditando(produto.id);

    setNomeEdit(produto.nome || "");
    setDescricaoEdit(produto.descricao || "");
    setPrecoEdit(produto.preco || "");
    setEstoqueEdit(produto.estoque || "");

    setImagemAtual(produto.imagem || "");
    setImagem(null);
  }

  // ==============================
  // CANCELAR EDIÇÃO
  // ==============================

  function cancelarEdicao() {
    setEditando(null);

    setNomeEdit("");
    setDescricaoEdit("");
    setPrecoEdit("");
    setEstoqueEdit("");

    setImagemAtual("");
    setImagem(null);
  }

  // ==============================
  // SALVAR EDIÇÃO
  // ==============================

  async function salvarEdicao(e) {
    e.preventDefault();

    try {
      let novaImagem = imagemAtual;

      if (imagem) {
        const imagemEnviada = await enviarImagem(imagem);

        if (imagemEnviada) {
          novaImagem = imagemEnviada;
        }
      }

      const resposta = await fetch(
        `${API}/produtos/${editando}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: nomeEdit,
            descricao: descricaoEdit,
            preco: Number(precoEdit),
            estoque: Number(estoqueEdit),
            imagem: novaImagem,
          }),
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao atualizar produto");
      }

      const produtoAtualizado = await resposta.json();

      setProdutos((listaAtual) =>
        listaAtual.map((produto) =>
          produto.id === editando
            ? produtoAtualizado
            : produto
        )
      );

      cancelarEdicao();

      alert("Produto atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao editar:", error);

      alert("Não foi possível atualizar o produto.");
    }
  }

  // ==============================
  // EXCLUIR PRODUTO
  // ==============================

  async function excluirProduto(id) {
    const confirmar = window.confirm(
      "Deseja realmente excluir este produto?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(
        `${API}/produtos/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao excluir produto");
      }

      setProdutos((listaAtual) =>
        listaAtual.filter(
          (produto) => produto.id !== id
        )
      );

      alert("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir:", error);

      alert("Não foi possível excluir o produto.");
    }
  }

  // ==============================
  // ALTERAR STATUS DO PEDIDO
  // ==============================

  async function alterarStatusPedido(id, novoStatus) {
    try {
      const resposta = await fetch(
        `${API}/pedidos/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: novoStatus,
          }),
        }
      );

      if (!resposta.ok) {
        throw new Error(
          "Erro ao atualizar status"
        );
      }

      const pedidoAtualizado =
        await resposta.json();

      setPedidos((listaAtual) =>
        listaAtual.map((pedido) =>
          pedido.id === id
            ? {
                ...pedido,
                status:
                  pedidoAtualizado.status ||
                  novoStatus,
              }
            : pedido
        )
      );

      alert(
        "Status do pedido atualizado com sucesso!"
      );
    } catch (error) {
      console.error(
        "Erro ao atualizar status:",
        error
      );

      alert(
        "Não foi possível atualizar o status."
      );
    }
  }

  // ==============================
  // SAIR
  // ==============================

  function sairAdmin() {
    navigate("/");
  }

  // ==============================
  // FILTRO DE PRODUTOS
  // ==============================

  const produtosFiltrados = produtos.filter(
    (produto) =>
      (produto.nome || "")
        .toLowerCase()
        .includes(
          buscaProduto.toLowerCase()
        )
  );

  // ==============================
  // FILTRO DE PEDIDOS
  // ==============================

  const pedidosFiltrados = pedidos.filter(
    (pedido) => {
      const busca =
        buscaCliente.toLowerCase();

      const cliente =
        (pedido.cliente || "")
          .toLowerCase();

      const email =
        (pedido.email || "")
          .toLowerCase();

      const telefone =
        (pedido.telefone || "")
          .toLowerCase();

      return (
        cliente.includes(busca) ||
        email.includes(busca) ||
        telefone.includes(busca)
      );
    }
  );

  // ==============================
  // ESTATÍSTICAS
  // ==============================

  const totalProdutos =
    produtos.length;

  const totalPedidos =
    pedidos.length;

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
    pedidos.reduce(
      (total, pedido) =>
        total +
        Number(
          pedido.total ||
          pedido.valor ||
          0
        ),
      0
    );

  const pedidosPendentes =
    pedidos.filter(
      (pedido) =>
        pedido.status === "pendente"
    ).length;

  const pedidosPagos =
    pedidos.filter(
      (pedido) =>
        pedido.status === "pago"
    ).length;

  const pedidosEmProducao =
    pedidos.filter(
      (pedido) =>
        pedido.status === "producao"
    ).length;

  const pedidosEnviados =
    pedidos.filter(
      (pedido) =>
        pedido.status === "enviado"
    ).length;

  const pedidosConcluidos =
    pedidos.filter(
      (pedido) =>
        pedido.status === "concluido"
    ).length;

  const pedidosCancelados =
    pedidos.filter(
      (pedido) =>
        pedido.status === "cancelado"
    ).length;

  const produtosEstoqueBaixo =
    produtos.filter(
      (produto) =>
        Number(
          produto.estoque || 0
        ) <= 5
    );

  // ==============================
  // RETURN
  // ==============================

  return (
    <div className="admin">

      <div className="topo-admin">

        <h1>
          Painel Administrativo
        </h1>

        <button
          className="btn-sair"
          onClick={sairAdmin}
        >
          Sair
        </button>

      </div>


      {/* DASHBOARD */}

      <div className="cardsAdmin">

        <div className="cardAdmin">
          <h3>📦 Produtos</h3>
          <strong>
            {totalProdutos}
          </strong>
        </div>


        <div className="cardAdmin">
          <h3>📋 Pedidos</h3>
          <strong>
            {totalPedidos}
          </strong>
        </div>


        <div className="cardAdmin">
          <h3>👁️ Visitas</h3>
          <strong>
            {visitas}
          </strong>
        </div>


        <div className="cardAdmin">
          <h3>💰 Faturamento</h3>
          <strong>
            R$ {faturamento.toFixed(2)}
          </strong>
        </div>


        <div className="cardAdmin">
          <h3>⏳ Pendentes</h3>
          <strong>
            {pedidosPendentes}
          </strong>
        </div>


        <div className="cardAdmin">
          <h3>💳 Pagos</h3>
          <strong>
            {pedidosPagos}
          </strong>
        </div>


        <div className="cardAdmin">
          <h3>🏭 Em Produção</h3>
          <strong>
            {pedidosEmProducao}
          </strong>
        </div>


        <div className="cardAdmin">
          <h3>🚚 Enviados</h3>
          <strong>
            {pedidosEnviados}
          </strong>
        </div>


        <div className="cardAdmin">
          <h3>✅ Concluídos</h3>
          <strong>
            {pedidosConcluidos}
          </strong>
        </div>


        <div className="cardAdmin">
          <h3>📦 Estoque Total</h3>
          <strong>
            {totalEstoque}
          </strong>
        </div>


        <div className="cardAdmin">
          <h3>⚠️ Estoque Baixo</h3>
          <strong>
            {produtosEstoqueBaixo.length}
          </strong>
        </div>


        <div className="cardAdmin">
          <h3>❌ Cancelados</h3>
          <strong>
            {pedidosCancelados}
          </strong>
        </div>

      </div>


      {/* ALERTA ESTOQUE */}

      {produtosEstoqueBaixo.length > 0 && (

        <div className="alerta-estoque">

          <h2>
            ⚠️ Produtos com estoque baixo
          </h2>

          <div className="lista-estoque-baixo">

            {produtosEstoqueBaixo.map(
              (produto) => (

                <div
                  className="item-estoque-baixo"
                  key={produto.id}
                >

                  {produto.imagem && (
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                    />
                  )}

                  <div>

                    <strong>
                      {produto.nome}
                    </strong>

                    <p>
                      Apenas{" "}
                      {produto.estoque}{" "}
                      unidades disponíveis
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )}


      {/* CADASTRAR PRODUTO */}

      <h2>
        Cadastrar Produto
      </h2>

      <form
        onSubmit={criarProduto}
      >

        <input
          placeholder="Nome do produto"
          value={nome}
          onChange={(e) =>
            setNome(e.target.value)
          }
          required
        />


        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) =>
            setDescricao(
              e.target.value
            )
          }
        />


        <input
          type="number"
          step="0.01"
          placeholder="Preço"
          value={preco}
          onChange={(e) =>
            setPreco(e.target.value)
          }
          required
        />


        <input
  type="number"
  min="0"
  placeholder="Estoque"
  value={estoque}
  onChange={(e) => setEstoque(e.target.value)}
  required
/>


        <input
          id="imagem-produto"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImagem(
              e.target.files[0]
            )
          }
        />


        <button type="submit">
          Cadastrar Produto
        </button>

      </form>


      {/* EDITAR PRODUTO */}

      {editando && (

        <form
          className="form-edicao"
          onSubmit={salvarEdicao}
        >

          <h2>
            Editar Produto
          </h2>


          <label>
            Nome do produto
          </label>

          <input
            value={nomeEdit}
            onChange={(e) =>
              setNomeEdit(
                e.target.value
              )
            }
            required
          />


          <label>
            Descrição
          </label>

          <textarea
            value={descricaoEdit}
            onChange={(e) =>
              setDescricaoEdit(
                e.target.value
              )
            }
          />


          <label>
            Preço
          </label>

          <input
            type="number"
            step="0.01"
            value={precoEdit}
            onChange={(e) =>
              setPrecoEdit(
                e.target.value
              )
            }
            required
          />


          <label>
            Estoque
          </label>

          <input
            type="number"
            value={estoqueEdit}
            onChange={(e) =>
              setEstoqueEdit(
                e.target.value
              )
            }
            required
          />


          {imagemAtual && (

            <>

              <label>
                Imagem atual
              </label>

              <img
                src={imagemAtual}
                alt="Imagem atual"
                className="imagem-edicao"
              />

            </>

          )}


          <label>
            Nova imagem do produto
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImagem(
                e.target.files[0]
              )
            }
          />


          <button
            type="submit"
            className="btn-salvar"
          >
            Salvar Alterações
          </button>


          <button
            type="button"
            className="btn-cancelar"
            onClick={cancelarEdicao}
          >
            Cancelar
          </button>

        </form>

      )}


      {/* PRODUTOS */}

      <h2>
        Produtos
      </h2>


      <input
        placeholder="Buscar produto"
        value={buscaProduto}
        onChange={(e) =>
          setBuscaProduto(
            e.target.value
          )
        }
      />


      <p>
        Exibindo{" "}
        {produtosFiltrados.length}{" "}
        de {produtos.length} produtos
      </p>


      <div className="lista-produtos">

        {produtosFiltrados.length === 0 ? (

          <p>
            Nenhum produto encontrado.
          </p>

        ) : (

          produtosFiltrados.map(
            (produto) => (

              <div
                className="card-produto"
                key={produto.id}
              >

                {produto.imagem && (

                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                  />

                )}


                <h3>
                  {produto.nome}
                </h3>


                <p>
                  {produto.descricao}
                </p>


                <strong>
                  R$ {Number(
                    produto.preco || 0
                  ).toFixed(2)}
                </strong>


                <p>
                  Estoque:{" "}
                  {produto.estoque}
                </p>


                <button
                  className="btn-editar"
                  onClick={() =>
                    abrirEdicao(
                      produto
                    )
                  }
                >
                  Editar
                </button>


                <button
                  className="btn-excluir"
                  onClick={() =>
                    excluirProduto(
                      produto.id
                    )
                  }
                >
                  Excluir
                </button>

              </div>

            )
          )

        )}

      </div>


      {/* PEDIDOS */}

      <h2>
        Pedidos
      </h2>


      <input
        placeholder="Buscar cliente, email ou telefone"
        value={buscaCliente}
        onChange={(e) =>
          setBuscaCliente(
            e.target.value
          )
        }
      />


      <p>
        Exibindo{" "}
        {pedidosFiltrados.length}{" "}
        de {pedidos.length} pedidos
      </p>


      <div className="lista-pedidos">

        {pedidosFiltrados.length === 0 ? (

          <p className="sem-pedidos">
            Nenhum pedido encontrado.
          </p>

        ) : (

          pedidosFiltrados.map(
            (pedido) => (

              <div
                className="card-pedido"
                key={pedido.id}
              >

                <div className="topo-pedido">

                  <h3>
                    Pedido #{pedido.id}
                  </h3>


                  <select
                    className={`status-pedido ${
                      pedido.status ||
                      "pendente"
                    }`}
                    value={
                      pedido.status ||
                      "pendente"
                    }
                    onChange={(e) =>
                      alterarStatusPedido(
                        pedido.id,
                        e.target.value
                      )
                    }
                  >

                    <option value="pendente">
                      Pendente
                    </option>

                    <option value="pago">
                      Pago
                    </option>

                    <option value="producao">
                      Em produção
                    </option>

                    <option value="enviado">
                      Enviado
                    </option>

                    <option value="concluido">
                      Concluído
                    </option>

                    <option value="cancelado">
                      Cancelado
                    </option>

                  </select>

                </div>


                <div className="dados-cliente">

                  <p>
                    <strong>
                      Cliente:
                    </strong>{" "}
                    {pedido.cliente ||
                      "Não informado"}
                  </p>


                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {pedido.email ||
                      "Não informado"}
                  </p>


                  <p>
                    <strong>
                      Telefone:
                    </strong>{" "}
                    {pedido.telefone ||
                      "Não informado"}
                  </p>


                  <p>
                    <strong>
                      Endereço:
                    </strong>{" "}
                    {pedido.endereco ||
                      "Não informado"}
                  </p>

                </div>


                <h4>
                  Produtos
                </h4>


                <div className="itens-pedido">

                  {Array.isArray(
                    pedido.itens
                  ) &&
                    pedido.itens.map(
                      (item, index) => (

                        <div
                          className="item-pedido"
                          key={
                            `${pedido.id}-${index}`
                          }
                        >

                          {item.imagem && (

                            <img
                              src={item.imagem}
                              alt={
                                item.nome ||
                                "Produto"
                              }
                            />

                          )}


                          <div>

                            <strong>
                              {item.nome ||
                                "Produto"}
                            </strong>


                            <p>
                              Quantidade:{" "}
                              {item.quantidade ||
                                1}
                            </p>


                            <p>
                              R$ {Number(
                                item.preco ||
                                0
                              ).toFixed(2)}
                            </p>

                          </div>

                        </div>

                      )
                    )}

                </div>


                <div className="rodape-pedido">

                  <strong>
                    Total: R$ {Number(
                      pedido.total ||
                      pedido.valor ||
                      0
                    ).toFixed(2)}
                  </strong>


                  <small>
                    {pedido.createdAt
                      ? new Date(
                          pedido.createdAt
                        ).toLocaleString(
                          "pt-BR"
                        )
                      : "Data não informada"}
                  </small>

                </div>

              </div>

            )
          )

        )}

      </div>

    </div>
  );
}
