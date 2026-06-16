import { BrowserRouter, Routes, Route } from "react-router-dom";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Produtos from "../pages/Produtos";
import ProdutoDetalhe from "../pages/ProdutoDetalhe";
import Carrinho from "../pages/Carrinho";
import Checkout from "../pages/Checkout";
import Pix from "../pages/Pix";
import Confirmacao from "../pages/Confirmacao";
import Admin from "../pages/Admin";
import AdminLogin from "../pages/AdminLogin";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
         path="/admin-login"
         element={<AdminLogin />}
        />

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/produtos"
          element={<Produtos />}
        />

        <Route
          path="/produto/:id"
          element={<Produto />}
        />

        <Route
          path="/carrinho"
          element={<Carrinho />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/pix"
          element={<Pix />}
        />

        <Route
          path="/confirmacao"
          element={<Confirmacao />}
        />

      </Routes>
    </BrowserRouter>
  );
}