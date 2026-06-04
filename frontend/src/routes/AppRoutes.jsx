import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from '../pages/Home'
import Produtos from '../pages/Produtos'

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

      </Routes>
    </BrowserRouter>
  )
}