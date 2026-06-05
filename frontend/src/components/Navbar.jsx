import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        DIVA SUBLIMAÇÃO
      </div>

      <div className="menu">
        <Link to="/">Home</Link>
        <Link to="/produtos">Produtos</Link>
      </div>
    </nav>
  );
}