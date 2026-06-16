import { useLocation, useNavigate } from "react-router-dom";

export default function Preview() {
  const location = useLocation();
  const navigate = useNavigate();

  const produto = location.state?.produto;

  if (!produto) {
    return (
      <div>
        <h2>Produto não encontrado</h2>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    );
  }

  function irParaCheckout() {
    navigate("/checkout", { state: { produto } });
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Preview do Produto</h1>

      <div>
        <h2>{produto.nome}</h2>
        <p>{produto.descricao}</p>

        {produto.imagem && (
          <img
            src={produto.imagem}
            alt={produto.nome}
            style={{ width: 200 }}
          />
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => navigate(-1)}>
          Voltar
        </button>

        <button onClick={irParaCheckout}>
          Confirmar Pedido
        </button>
      </div>
    </div>
  );
}