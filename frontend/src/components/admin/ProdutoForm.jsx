import { useState } from "react";
import "./ProdutoForm.css";

const API = "https://sublimacao-store.onrender.com";

export default function ProdutoForm({

  carregarProdutos,

  editando,
  setEditando,

  nome,
  setNome,

  descricao,
  setDescricao,

  preco,
  setPreco,

  estoque,
  setEstoque

}) {

  const [imagem, setImagem] = useState(null);

  const [preview, setPreview] = useState("");

  async function uploadImagem() {

    if (!imagem) return "";

    const formData = new FormData();

    formData.append("imagem", imagem);

    const res = await fetch(`${API}/upload`, {

      method: "POST",

      body: formData

    });

    const data = await res.json();

    return data.url;

  }

  async function salvar(e){

    e.preventDefault();

    let imagemFinal="";

    if(imagem){

      imagemFinal = await uploadImagem();

    }

    const payload={

      nome,

      descricao,

      preco:Number(preco),

      estoque:Number(estoque),

      imagem:imagemFinal

    };

    const url=editando

      ? `${API}/produtos/${editando.id}`

      : `${API}/produtos`;

    const metodo=editando

      ? "PUT"

      : "POST";

    await fetch(url,{

      method:metodo,

      headers:{

        "Content-Type":"application/json"

      },

      body:JSON.stringify(payload)

    });

    setNome("");
    setDescricao("");
    setPreco("");
    setEstoque("");

    setImagem(null);

    setPreview("");

    setEditando(null);

    carregarProdutos();

  }

  return(

<form
className="produtoForm"
onSubmit={salvar}
>

<h2>

{editando

? "Editar Produto"

: "Novo Produto"}

</h2>

<input
placeholder="Nome"
value={nome}
onChange={(e)=>setNome(e.target.value)}
/>

<textarea
placeholder="Descrição"
value={descricao}
onChange={(e)=>setDescricao(e.target.value)}
/>

<input
type="number"
placeholder="Preço"
value={preco}
onChange={(e)=>setPreco(e.target.value)}
/>

<input
type="number"
placeholder="Estoque"
value={estoque}
onChange={(e)=>setEstoque(e.target.value)}
/>

<input
type="file"
accept="image/*"
onChange={(e)=>{

const file=e.target.files[0];

setImagem(file);

if(file){

setPreview(

URL.createObjectURL(file)

);

}

}}
/>

{preview && (

<img

src={preview}

className="previewProduto"

alt="preview"

/>

)}

<button>

{editando

? "Salvar"

: "Cadastrar"}

</button>

</form>

  );

}