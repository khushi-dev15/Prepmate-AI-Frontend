import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    closeMenu();
    navigate("/auth");
  };

  const handleLogoClick = () => {
    closeMenu();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={handleLogoClick}>
        PrepMate AI
      </div>
      
      <button 
        className={`hamburger ${menuOpen ? "active" : ""}`} 
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/features" onClick={closeMenu}>Features</Link></li>
        <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
        <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
        {token ? (
          <li><button className="auth-btn" onClick={handleLogout}>Logout</button></li>
        ) : (
          <li><Link className="auth-btn" to="/auth" onClick={closeMenu}>Login/Register</Link></li>
        )}
      </ul>
    </nav>
  );
}
