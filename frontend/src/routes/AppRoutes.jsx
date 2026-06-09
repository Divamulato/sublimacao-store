import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Produtos from "../pages/Produtos";
import Admin from "../pages/Admin";
import Carrinho from "../pages/Carrinho";
import Produto from "../pages/Produto";
import Checkout from "../pages/Checkout";
import Pix from "../pages/Pix";
import Confirmacao from "../pages/Confirmacao";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

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