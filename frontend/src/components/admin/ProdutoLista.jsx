import "./ProdutoLista.css";

export default function ProdutoLista({

  produtos,

  editarProduto,

  deletarProduto

}) {

  if (produtos.length === 0) {

    return (

      <div className="listaProdutos">

        <h2>Produtos</h2>

        <p>Nenhum produto cadastrado.</p>

      </div>

    );

  }

  return (

    <div className="listaProdutos">

      <h2>Produtos Cadastrados</h2>

      <div className="gridProdutos">

        {produtos.map((produto) => (

          <div
            className="cardProduto"
            key={produto.id}
          >

            <img
              src={produto.imagem}
              alt={produto.nome}
            />

            <h3>{produto.nome}</h3>

            <p className="descricao">
              {produto.descricao}
            </p>

            <div className="info">

              <strong>

                R$ {Number(produto.preco).toFixed(2)}

              </strong>

              <span>

                Estoque: {produto.estoque}

              </span>

            </div>

            <div className="acoes">

              <button
                className="editar"
                onClick={() => editarProduto(produto)}
              >
                ✏️ Editar
              </button>

              <button
                className="excluir"
                onClick={() => deletarProduto(produto.id)}
              >
                🗑 Excluir
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}