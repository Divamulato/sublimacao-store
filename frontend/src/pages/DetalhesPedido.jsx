import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./DetalhesPedido.css";


const API = "https://sublimacao-store.onrender.com";


export default function DetalhesPedido(){

const { id } = useParams();

const navigate = useNavigate();

const [pedido,setPedido] = useState(null);



useEffect(()=>{

buscarPedido();

},[]);



async function buscarPedido(){

try{


const resposta =
await fetch(`${API}/pedidos/${id}`);


const dados =
await resposta.json();


setPedido(dados);



}catch(error){

console.log(error);

}


}



if(!pedido){

return (

<h2>
Carregando pedido...
</h2>

);

}



return(

<div className="detalhesPedido">


<button
onClick={()=>navigate("/admin")}
>
⬅ Voltar
</button>



<h1>
Pedido #{pedido.id}
</h1>



<section>

<h2>
👤 Cliente
</h2>


<p>
<strong>Nome:</strong>
{" "}
{pedido.cliente}
</p>


<p>
<strong>Email:</strong>
{" "}
{pedido.email}
</p>


<p>
<strong>Telefone:</strong>
{" "}
{pedido.telefone}
</p>


<p>
<strong>Endereço:</strong>
{" "}
{pedido.endereco}
</p>



</section>




<section>

<h2>
🛒 Produtos
</h2>


{
pedido.itens?.map((item,index)=>(


<div
className="itemPedido"
key={index}
>


<h3>
{item.nome}
</h3>


<p>
Quantidade:
{item.quantidade}
</p>


<p>
Preço:
R$ {item.preco}
</p>



{
item.imagem &&

<img
src={item.imagem}
alt={item.nome}
/>

}



{
item.fotoCliente &&

<div>

<h4>
Arte enviada pelo cliente
</h4>


<img
src={item.fotoCliente}
alt="Arte cliente"
/>


</div>

}



</div>


))
}



</section>




<section>

<h2>
💰 Pagamento
</h2>


<p>
Total:
R$ {pedido.total}
</p>


<p>
Status:
{pedido.status}
</p>


</section>




</div>


);


}