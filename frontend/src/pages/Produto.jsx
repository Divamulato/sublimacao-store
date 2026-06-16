import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API =
  "https://sublimacao-store.onrender.com";

export default function Produto() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [arquivo, setArquivo] =
    useState(null);

  const [enviando, setEnviando] =
    useState(false);

  const [fotoCliente, setFotoCliente] =
    useState("");

  const [produto, setProduto] =
    useState(null);

  const [zoom, setZoom] =
    useState(false);

  useEffect(() => {

    async function carregar() {

      try {

        const res =
          await fetch(`${API}/produtos`);

        const data =
          await res.json();

        const encontrado =
          data.find(
            p => p.id === Number(id)
          );

        setProduto(encontrado);

      } catch (error) {

        console.log(error);

      }

    }

    carregar();

  }, [id]);

  async function uploadImagem() {

    if (!arquivo) {
      alert("Selecione uma imagem.");
      return;
    }

    setEnviando(true);

    const formData = new FormData();

    formData.append(
      "imagem",
      arquivo
    );

    try {

      const res =
        await fetch(
          "https://sublimacao-store.onrender.com/upload",
          {
            method: "POST",
            body: formData
          }
        );

      const data =
        await res.json();

      setFotoCliente(data.url);

      alert(
        "Imagem enviada com sucesso!"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Erro ao enviar imagem"
      );

    }

    setEnviando(false);
  }

  function adicionarCarrinho() {
  const carrinho =
    JSON.parse(
      localStorage.getItem("carrinho")
    ) || [];

  const existe = carrinho.find(
    item => item.id === produto.id
  );

  if (existe) {
    existe.quantidade += 1;
  } else {
    carrinho.push({
      ...produto,
      quantidade: 1,
      fotoCliente
    });
  }

  localStorage.setItem(
    "carrinho",
    JSON.stringify(carrinho)
  );

 localStorage.setItem(
  "paginaAnterior",
  "/produtos"
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
        color: "#000"
      }}
    >

      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          border: "none",
          borderRadius: "8px",
          background: "#333",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        ← Voltar
      </button>

      <h1>{produto.nome}</h1>

      <h3>📷 Sua arte</h3>

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setArquivo(
            e.target.files[0]
          )
        }
      />

      <br />
      <br />

      <button
        onClick={uploadImagem}
      >
        {enviando
          ? "Enviando..."
          : "Enviar Foto"}
      </button>

      <br />
      <br />

      {fotoCliente && (
        <>
          <p>
            ✅ Arte enviada
          </p>

          <img
            src={fotoCliente}
            alt="Arte Cliente"
            style={{
              width: "200px",
              borderRadius: "10px",
              marginBottom: "20px"
            }}
          />
        </>
      )}

      {produto.imagem && (
        <>
          <img
            src={produto.imagem}
            alt={produto.nome}
            onClick={() =>
              setZoom(true)
            }
            style={{
              width: "400px",
              maxWidth: "100%",
              borderRadius: "10px",
              cursor: "zoom-in"
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
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
                cursor: "zoom-out"
              }}
            >
              <img
                src={produto.imagem}
                alt={produto.nome}
                style={{
                  maxWidth: "90%",
                  maxHeight: "90%",
                  borderRadius: "12px"
                }}
              />
            </div>
          )}
        </>
      )}

      <p>
        {produto.descricao}
      </p>

      <h2>
        R$ {Number(
          produto.preco
        ).toFixed(2)}
      </h2>

      <button
        onClick={adicionarCarrinho}
        style={{
          padding: "12px 25px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Adicionar ao Carrinho
      </button>

    </div>
  );
}