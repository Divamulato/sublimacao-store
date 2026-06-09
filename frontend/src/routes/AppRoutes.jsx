import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Produtos from "../pages/Produtos";
import Admin from "../pages/Admin";
import Carrinho from "../pages/Carrinho";
import Produto from "../pages/Produto";

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

      </Routes>
    </BrowserRouter>
  );
}