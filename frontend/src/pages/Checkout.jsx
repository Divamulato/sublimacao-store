import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const produto = location.state?.produto;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);


  async function continuar() {

    console.log("CHEGOU NA FUNÇÃO CONTINUAR");

    if (loading) return;


    const carrinho =
      JSON.parse(localStorage.getItem("carrinho")) || [];


    if (!carrinho.length) {
      alert("Seu carrinho está vazio");
      navigate("/carrinho");
      return;
    }


    if (!nome || !email || !telefone || !endereco) {

      alert(
        "Preencha nome, e-mail, telefone e endereço."
      );

      return;
    }


    setLoading(true);


    try {


      console.log("=== CARRINHO ===");
      console.log(carrinho);



      /*
      ==========================
      CADASTRA CLIENTE
      ==========================
      */

     const usuarioResponse = await fetch(
  "https://sublimacao-store.onrender.com/usuarios",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome,
      email,
      telefone
    })
  }
);

let usuarioId = null;

if (usuarioResponse.ok) {
  const usuario = await usuarioResponse.json();
  usuarioId = usuario.id;
} else {
  const erro = await usuarioResponse.json();

  if (erro.error === "Este e-mail já está cadastrado.") {
    console.log("Usuário já cadastrado.");
  } else {
    throw new Error(erro.error);
  }
}


      if (!usuarioResponse.ok) {

        const erro =
          await usuarioResponse.json();


        if (
          erro.error !==
          "Este e-mail já está cadastrado."
        ) {

          throw new Error(
            erro.error
          );

        }

      }



      /*
      ==========================
      CALCULA TOTAL
      ==========================
      */

      const total =
        carrinho.reduce(
          (acc, item) =>
            acc +
            Number(item.preco) *
            item.quantidade,

          0
        );



      /*
      ==========================
      CRIA PEDIDO
      ==========================
      */

      const pedidoLocal = {
  usuarioId,

  itens: carrinho,
  total,

  cliente: nome,
  email,
  telefone,
  endereco,
  observacao,

  status: "pendente",
  data: new Date().toISOString()
};



      console.log(
        "PEDIDO:",
        pedidoLocal
      );



      const res = await fetch(

        "https://sublimacao-store.onrender.com/pedidos",

        {

          method: "POST",

          headers: {

            "Content-Type":
            "application/json"

          },

          body:
          JSON.stringify(
            pedidoLocal
          )

        }

      );



      const data =
        await res.json();



      if (!res.ok) {

        throw new Error(
          data?.error ||
          "Erro ao criar pedido"
        );

      }



      console.log(
        "PEDIDO CRIADO:",
        data
      );



      /*
      ==========================
      SALVA CLIENTE LOCAL
      ==========================
      */

      localStorage.setItem(

        "cliente",

        JSON.stringify({

          nome,

          email,

          telefone,

          endereco,

          observacao

        })

      );



      /*
      ==========================
      SALVA ID PEDIDO
      ==========================
      */

      localStorage.setItem(

        "pedidoId",

        data.id

      );



      localStorage.setItem(
  "pedidoAtual",
  JSON.stringify({
    id: data.id,
    total,
    itens: carrinho,
    cliente: nome,
    telefone,
    endereco
  })
);



      /*
      ==========================
      HISTÓRICO LOCAL
      ==========================
      */


      let pedidos =

        JSON.parse(

          localStorage.getItem(
            "pedidos"
          )

        ) || [];



      pedidos.push({

        id:data.id,

        ...pedidoLocal

      });



      localStorage.setItem(

        "pedidos",

        JSON.stringify(
          pedidos
        )

      );



      /*
      ==========================
      LIMPA CARRINHO
      ==========================
      */

      localStorage.removeItem(
        "carrinho"
      );



      navigate("/pix");



    } catch(error) {


      console.error(
        "ERRO CHECKOUT:",
        error
      );


      alert(
        "Erro ao criar pedido"
      );


    }


    setLoading(false);

  }



  if (
    !produto &&
    !localStorage.getItem("carrinho")
  ) {

    return (
      <h2>
        Carrinho vazio
      </h2>
    );

  }



  return (

    <div
      style={{
        padding:40,
        maxWidth:700,
        margin:"0 auto"
      }}
    >


      <button
        onClick={() =>
          navigate("/carrinho")
        }
      >

        ← Voltar

      </button>



      <h1>
        Finalizar Pedido
      </h1>



      <input

        placeholder="Nome completo"

        value={nome}

        onChange={(e)=>
          setNome(e.target.value)
        }

      />


      <br/>
      <br/>



      <input
  type="email"
  placeholder="E-mail"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

<br />
<br />



      <input

        placeholder="WhatsApp"

        value={telefone}

        onChange={(e)=>
          setTelefone(e.target.value)
        }

      />


      <br/>
      <br/>



      <input

        placeholder="Endereço"

        value={endereco}

        onChange={(e)=>
          setEndereco(e.target.value)
        }

      />


      <br/>
      <br/>



      <textarea

        placeholder="Observações"

        value={observacao}

        onChange={(e)=>
          setObservacao(e.target.value)
        }

      />


      <br/>
      <br/>



      <button

        onClick={continuar}

        disabled={loading}

      >

        {
          loading
          ?
          "Criando pedido..."
          :
          "Continuar para PIX"
        }


      </button>



    </div>

  );

}