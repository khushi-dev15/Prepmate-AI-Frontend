import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMenuOpen(false);
    navigate("/auth");
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => { handleNavClick("/"); }}>
        PrepMate AI
      </div>
      
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/features" onClick={() => setMenuOpen(false)}>Features</Link></li>
        <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
        <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
        {token ? (
          <li><button className="auth-btn" onClick={handleLogout}>Logout</button></li>
        ) : (
          <li><Link className="auth-btn" to="/auth" onClick={() => setMenuOpen(false)}>Login/Register</Link></li>
        )}
      </ul>
    </nav>
  );
}
