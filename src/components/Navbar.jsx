import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        PrepMate AI
      </div>
      
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/features">Features</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        {token ? (
          <li><button className="auth-btn" onClick={handleLogout}>Logout</button></li>
        ) : (
          <li><Link className="auth-btn" to="/auth">Login/Register</Link></li>
        )}
      </ul>
    </nav>
  );
}
