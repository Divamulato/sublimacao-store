import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API = "https://sublimacao-store.onrender.com";

export default function Produto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [arquivo, setArquivo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [produto, setProduto] = useState(null);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch(`${API}/produtos`);
        const data = await res.json();

        const encontrado = data.find(
          (p) => p.id === Number(id)
        );

        setProduto(encontrado);
      } catch (error) {
        console.log(error);
      }
    }

    carregar();
  }, [id]);

  function handleArquivo(e) {
    const file = e.target.files[0];
    setArquivo(file);
  }

  async function uploadImagem() {
    if (!arquivo) {
      alert("Selecione uma imagem.");
      return;
    }

    setEnviando(true);

    const formData = new FormData();
    formData.append("imagem", arquivo);

    try {
      const res = await fetch(
        `${API}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      navigate("/preview", {
        state: {
          produto,
          fotoCliente: data.url,
        },
      });
    } catch (error) {
      console.log(error);
      alert("Erro ao enviar imagem.");
    }

    setEnviando(false);
  }

  function adicionarCarrinho() {
    const carrinho =
      JSON.parse(
        localStorage.getItem("carrinho")
      ) || [];

    const existe = carrinho.find(
      (item) => item.id === produto.id
    );

    if (existe) {
      existe.quantidade += 1;
    } else {
      carrinho.push({
        ...produto,
        quantidade: 1,
      });
    }

    localStorage.setItem(
      "carrinho",
      JSON.stringify(carrinho)
    );

    navigate("/carrinho");
  }

  if (!produto) {
    return <h2>Carregando...</h2>;
  }

  return (
    <div
      style={{
        padding: "40px",
        color: "#000",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <button
        onClick={() => navigate(-1)}
      >
        ← Voltar
      </button>

      <h1>{produto.nome}</h1>

      {produto.imagem && (
        <>
          <img
            src={produto.imagem}
            alt={produto.nome}
            onClick={() => setZoom(true)}
            style={{
              width: "400px",
              maxWidth: "100%",
              borderRadius: "12px",
              cursor: "zoom-in",
              marginBottom: "20px",
            }}
          />

          {zoom && (
            <div
              onClick={() =>
                setZoom(false)
              }
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  "rgba(0,0,0,0.9)",
                display: "flex",
                justifyContent:
                  "center",
                alignItems: "center",
                zIndex: 9999,
                cursor: "zoom-out",
              }}
            >
              <img
                src={produto.imagem}
                alt={produto.nome}
                style={{
                  maxWidth: "90%",
                  maxHeight: "90%",
                  borderRadius: "12px",
                }}
              />
            </div>
          )}
        </>
      )}

      <p>{produto.descricao}</p>

      <h2>
        R$
        {" "}
        {Number(
          produto.preco
        ).toFixed(2)}
      </h2>

      <hr
        style={{
          margin: "30px 0",
        }}
      />

      <h3>📷 Envie sua arte</h3>

      <input
        type="file"
        accept="image/*"
        onChange={handleArquivo}
      />

      <br />
      <br />

      <button
        onClick={uploadImagem}
        disabled={enviando}
      >
        {enviando
          ? "Enviando..."
          : "Personalizar Produto"}
      </button>

      <br />
      <br />

      <button
        onClick={adicionarCarrinho}
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
}