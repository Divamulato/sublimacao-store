import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Produtos from "../pages/Produtos";
import Produto from "../pages/Produto";
import Carrinho from "../pages/Carrinho";
import Checkout from "../pages/Checkout";
import Pix from "../pages/Pix";
import Confirmacao from "../pages/Confirmacao";
import Admin from "../pages/Admin";
import AdminLogin from "../pages/AdminLogin";
import Preview from "../pages/Preview";
import ProdutoDetalhe from "../pages/ProdutoDetalhe";
import Pedidos from "../pages/Pedidos";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/" element={<Home />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/produto/:id" element={<Produto />} />
      <Route path="/carrinho" element={<Carrinho />} />
      <Route path="/pix" element={<Pix />} />
      <Route path="/confirmacao" element={<Confirmacao />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/pedidos" element={<Pedidos />} />
      <Route path="/cadastro" element={<Cadastro />} />
    
    </Routes>
  );
}