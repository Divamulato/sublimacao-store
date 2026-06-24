import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API = "https://sublimacao-store.onrender.com";

export default function Produto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [arquivo, setArquivo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [fotoCliente, setFotoCliente] = useState("");
  const [produto, setProduto] = useState(null);
  const [zoom, setZoom] = useState(false);

  // 👇 NOVO: preview em tempo real (antes do upload)
  const [previewLocal, setPreviewLocal] = useState("");

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

  // 👇 NOVO: quando escolhe arquivo já aparece na hora
  function handleArquivo(e) {
    const file = e.target.files[0];

    setArquivo(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewLocal(url);
    }
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
        "https://sublimacao-store.onrender.com/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      setFotoCliente(data.url);

      alert("Imagem enviada com sucesso!");
    } catch (error) {
      console.log(error);
      alert("Erro ao enviar imagem");
    }

    setEnviando(false);
  }

  function adicionarCarrinho() {
    const carrinho =
      JSON.parse(localStorage.getItem("carrinho")) || [];

    const existe = carrinho.find(
      (item) => item.id === produto.id
    );

    if (existe) {
      existe.quantidade += 1;
    } else {
      carrinho.push({
        ...produto,
        quantidade: 1,
        fotoCliente,
      });
    }

    localStorage.setItem(
      "carrinho",
      JSON.stringify(carrinho)
    );

    localStorage.setItem("paginaAnterior", "/produtos");

    navigate("/carrinho");
  }

  if (!produto) {
    return <h2>Carregando...</h2>;
  }

  return (
  <div style={{ padding: "40px", color: "#000" }}>
    <button onClick={() => navigate(-1)}>
      ← Voltar
    </button>

    <h1>{produto.nome}</h1>

    {/* UPLOAD */}
    <h3>📷 Sua arte</h3>

    <input
      type="file"
      accept="image/*"
      onChange={handleArquivo}
    />

    <br />
    <br />

    <button onClick={uploadImagem}>
      {enviando ? "Enviando..." : "Enviar Foto"}
    </button>

    <br />
    <br />

    {/* PREVIEW */}
    <h3>☕ Preview da Caneca</h3>

    <div
      style={{
        width: "50px",
        maxWidth: "60%",
        position: "relative",
        marginTop: "10px",
      }}
    >
   <img
  src="/mockups/caneca-branca.png"
  alt="Caneca"
  onLoad={() => console.log("CANECA OK")}
  onError={() => console.log("ERRO CANECA")}
  style={{
    width: "300px",
    display: "block"
  }}
/>
      {(previewLocal || fotoCliente) && (
        <img
          src={previewLocal || fotoCliente}
          alt="Arte"
          style={{
            position: "absolute",
            top: "60px",
            left: "120px",
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "50px",
          }}
        />
      )}
    </div>

    <br />

    {/* PRODUTO */}
    {produto.imagem && (
      <img
        src={produto.imagem}
        alt={produto.nome}
        onClick={() => setZoom(true)}
        style={{
          width: "400px",
          maxWidth: "100%",
          borderRadius: "10px",
          cursor: "zoom-in",
        }}
      />
    )}

    {zoom && (
      <div
        onClick={() => setZoom(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.9)",
          display: "flex",
          justifyContent: "center",
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

    <p>{produto.descricao}</p>

    <h2>
      R$ {Number(produto.preco).toFixed(2)}
    </h2>

    <button onClick={adicionarCarrinho}>
      Adicionar ao Carrinho
    </button>
  </div>
)};