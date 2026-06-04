import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav>
      <h2>Diva Sublimação </h2>

      <div>
        <Link to="/">Home</Link>
        {' | '}
        <Link to="/produtos">Produtos</Link>
        {' | '}
        <Link to="/login">Login</Link>
      </div>
    </nav>
  )
}