import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const API = "https://sublimacao-store.onrender.com";

export default function Admin() {

  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [visitas, setVisitas] = useState(0);

  const [imagem, setImagem] = useState(null);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");

  const [editando, setEditando] = useState(null);

const [nomeEdit, setNomeEdit] = useState("");
const [descricaoEdit, setDescricaoEdit] = useState("");
const [precoEdit, setPrecoEdit] = useState("");
const [estoqueEdit, setEstoqueEdit] = useState("");

const [imagemAtual, setImagemAtual] = useState("");

  const [buscaProduto, setBuscaProduto] = useState("");
  const [buscaCliente, setBuscaCliente] = useState("");

  

  function abrirEdicao(produto){

  setEditando(produto.id);

  setNomeEdit(produto.nome);

  setDescricaoEdit(produto.descricao);

  setPrecoEdit(produto.preco);

  setEstoqueEdit(produto.estoque);
  
  setImagemAtual(produto.imagem);


}

  async function excluirProduto(id){

  const confirmar = window.confirm(
    "Deseja realmente excluir este produto?"
  );

  const totalProdutos = produtos.length;


const totalEstoque = produtos.reduce(
  (total,produto)=> total + produto.estoque,
  0
);



const faturamento = pedidos.reduce(

  (total,pedido)=>

  total + Number(pedido.valor || 0),

  0

);


  if(!confirmar){
    return;
  }


  try{


    const resposta = await fetch(
      `${API}/produtos/${id}`,
      {
        method:"DELETE"
      }
    );


    if(resposta.ok){


      setProdutos(
        produtos.filter(
          (produto)=>produto.id !== id
        )
      );


      alert("Produto excluído com sucesso!");

    }


  }catch(error){

    console.log("Erro ao excluir:",error);

  }


}



  async function carregarProdutos(){

    try {

      const resposta = await fetch(`${API}/produtos`);

      const dados = await resposta.json();

      setProdutos(dados);

    } catch(error){

      console.log("Erro produtos:", error);

    }

  }

  async function salvarEdicao(e){

 e.preventDefault();


 let novaImagem = null;


 if(imagem){

   novaImagem = await enviarImagem();

 }


  try{


    const resposta = await fetch(
      `${API}/produtos/${editando}`,
      {
        method:"PUT",

        headers:{
          "Content-Type":"application/json"
        },


        body:JSON.stringify({

 nome:nomeEdit,

 descricao:descricaoEdit,

 preco:Number(precoEdit),

 estoque:Number(estoqueEdit),

 imagem:novaImagem

})

      }
    );



    const produtoAtualizado = await resposta.json();



    setProdutos(

      produtos.map((produto)=>

        produto.id === editando

        ? produtoAtualizado

        : produto

      )

    );



    setEditando(null);


    alert("Produto atualizado!");



  }catch(error){

    console.log("Erro ao editar:",error);

  }


}



  async function carregarPedidos(){

    try {

      const resposta = await fetch(`${API}/pedidos`);

      const dados = await resposta.json();

      setPedidos(dados);

    } catch(error){

      console.log("Erro pedidos:", error);

    }

  }



  async function enviarImagem(){

    if(!imagem){
      return null;
    }


    const formData = new FormData();

    formData.append("imagem", imagem);


    try{

      const resposta = await fetch(`${API}/upload`,{

        method:"POST",
        body:formData

      });


      const dados = await resposta.json();


      return dados.url;


    }catch(error){

      console.log("Erro upload:", error);

      return null;

    }

  }




  async function criarProduto(e){

    e.preventDefault();


    try{


      let urlImagem = null;


      if(imagem){

        urlImagem = await enviarImagem();

      }



      const resposta = await fetch(`${API}/produtos`,{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },


        body:JSON.stringify({

          nome,
          descricao,
          preco:Number(preco),
          estoque:Number(estoque),
          imagem:urlImagem

        })

      });



      const novoProduto = await resposta.json();



      setProdutos([
        ...produtos,
        novoProduto
      ]);



      setNome("");
      setDescricao("");
      setPreco("");
      setEstoquе("");
      setImagem(null);



      alert("Produto criado com sucesso!");



    }catch(error){

      console.log("Erro criar produto:",error);

    }

  }





  useEffect(()=>{

  carregarProdutos();

  carregarPedidos();

  carregarVisitas();

},[]);

async function carregarVisitas(){

  try{

    const resposta = await fetch(`${API}/visitas`);

    const dados = await resposta.json();

    setVisitas(dados.total || 0);

  }catch(error){

    console.log(
      "Erro ao carregar visitas:",
      error
    );

  }

}

function sairAdmin(){

  navigate("/");

}

const totalProdutos = produtos.length;

const totalEstoque = produtos.reduce(
  (total, produto) => total + Number(produto.estoque || 0),
  0
);

const faturamento = pedidos.reduce(
  (total, pedido) => total + Number(pedido.valor || 0),
  0
);
const produtosEstoqueBaixo = produtos.filter(
  (produto) => Number(produto.estoque || 0) <= 5
);

  return (

  <div className="admin">


    <div className="topo-admin">

      <h1>Painel Administrativo</h1>


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

  <h3>
    Estoque baixo
  </h3>

  <strong>
    {produtosEstoqueBaixo.length}
  </strong>

</div>






      <div className="cardAdmin">

        <h3>
          Produtos
        </h3>

        <strong>
          {totalProdutos}
        </strong>

      </div>

      <div className="cardAdmin">

  <h3>
    Visitas
  </h3>

  <strong>
    {visitas}
  </strong>

</div>

      



      <div className="cardAdmin">

        <h3>
          Estoque
        </h3>

        <strong>
          {totalEstoque}
        </strong>

      </div>



      <div className="cardAdmin">

        <h3>
          Pedidos
        </h3>

        <strong>
          {pedidos.length}
        </strong>

      </div>



      <div className="cardAdmin">

        <h3>
          Faturamento
        </h3>

        <strong>
          R$ {faturamento.toFixed(2)}
        </strong>

      </div>


    </div>

    {produtosEstoqueBaixo.length > 0 && (

  <div className="alerta-estoque">

    <h2>
      ⚠️ Produtos com estoque baixo
    </h2>

    


    <div className="lista-estoque-baixo">

      {produtosEstoqueBaixo.map((produto)=>(

        <div
          className="item-estoque-baixo"
          key={produto.id}
        >

          <img
            src={produto.imagem}
            alt={produto.nome}
          />


          <div>

            <strong>
              {produto.nome}
            </strong>

            <p>
              Apenas {produto.estoque} unidades disponíveis
            </p>

          </div>

        </div>

      ))}

    </div>

  </div>

)}




      <form onSubmit={criarProduto}>


        <input
          placeholder="Nome do produto"
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

          onChange={(e)=>setImagem(e.target.files[0])}

        />



        <button type="submit">

          Cadastrar Produto

        </button>


      </form>

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

onChange={(e)=>setNomeEdit(e.target.value)}

placeholder="Digite o nome do produto"

/>



<label>
Descrição
</label>

<textarea

value={descricaoEdit}

onChange={(e)=>setDescricaoEdit(e.target.value)}

placeholder="Digite a descrição"

/>



<label>
Preço
</label>

<input

type="number"

value={precoEdit}

onChange={(e)=>setPrecoEdit(e.target.value)}

placeholder="Digite o preço"

/>



<label>
Estoque
</label>

<input

type="number"

value={estoqueEdit}

onChange={(e)=>setEstoqueEdit(e.target.value)}

placeholder="Quantidade disponível"

/>
<label>
Imagem atual
</label>


<img

src={imagemAtual}

alt="Imagem atual"

className="imagem-edicao"

/>


<label>
Nova imagem do produto
</label>


<input

type="file"

accept="image/*"

onChange={(e)=>setImagem(e.target.files[0])}

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

onClick={()=>{

setEditando(null);

setImagem(null);

setImagemAtual("");

}}

>

Cancelar

</button>



</form>

)}




      <h2>Produtos</h2>


      <input

        placeholder="Buscar produto"

        value={buscaProduto}

        onChange={(e)=>setBuscaProduto(e.target.value)}

      />


      <p>Total produtos: {produtos.length}</p>

      <div className="lista-produtos">

  {produtos.map((produto)=>(

    <div className="card-produto" key={produto.id}>


      <img
        src={produto.imagem}
        alt={produto.nome}
      />


      <h3>
        {produto.nome}
      </h3>


      <p>
        {produto.descricao}
      </p>


      <strong>
        R$ {produto.preco.toFixed(2)}
      </strong>


      <p>
        Estoque: {produto.estoque}
      </p>

      <button

  className="btn-editar"

  onClick={()=>abrirEdicao(produto)}

>

Editar

</button>

      <button

  className="btn-excluir"

  onClick={()=>excluirProduto(produto.id)}

>

Excluir

</button>


    </div>

  ))}

</div>





      <h2>Pedidos</h2>



      <input

        placeholder="Buscar cliente"

        value={buscaCliente}

        onChange={(e)=>setBuscaCliente(e.target.value)}

      />


      <p>Total pedidos: {pedidos.length}</p>



    </div>

  );

}



