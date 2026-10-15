
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UtensilsCrossed,
  Menu,
  X,
  ChefHat,
  ShoppingBag,
} from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo" onClick={closeMenu}>
        <span className="nav-logo-icon">
          <UtensilsCrossed size={25} />
        </span>

        <span className="nav-brand">
          Saffron <span>& Sage</span>
          <small>GOOD FOOD, GOOD MOMENTS</small>
        </span>
      </Link>

      <button
        type="button"
        className="nav-menu-toggle"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={25} /> : <Menu size={25} />}
      </button>

      <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/recipes" onClick={closeMenu}>Recipes</Link>
        <Link to="/food-order" onClick={closeMenu}>
          <ShoppingBag size={16} />
          Food Order
        </Link>
        <Link to="/table-booking" onClick={closeMenu}>Book a Table</Link>

        <Link to="/login" className="nav-login" onClick={closeMenu}>
          Login
        </Link>

        <Link to="/owner" className="nav-owner" onClick={closeMenu}>
          <ChefHat size={17} />
          Owner
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
