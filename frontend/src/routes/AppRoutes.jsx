import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from '../pages/Home'
import Produtos from '../pages/Produtos'

import Admin from "../pages/Admin";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/admin"
          element={<Admin />}
        />
        <Route
          path="/produtos"
          element={<Produtos />}
        />
  
        <Route
          path="/admin"
          element={<Admin />}
        />

      </Routes>
    </BrowserRouter>

    
  )
}