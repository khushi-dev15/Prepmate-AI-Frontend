import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"

export default function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    // keep navbar in sync with localStorage changes (login/logout from other tabs)
    const onStorage = (e) => {
      if (e.key === "token") setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target) &&
          hamburgerRef.current && !hamburgerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    closeMenu();
    navigate("/auth");
  };

  const handleLogoClick = () => {
    closeMenu();
    navigate("/");
  };
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div
        className="logo"
        onClick={handleLogoClick}
        onKeyDown={(e) => handleKeyDown(e, handleLogoClick)}
        tabIndex={0}
        role="button"
        aria-label="Go to home page"
      >
        PrepMate AI
      </div>

      <button
        ref={hamburgerRef}
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="nav-menu"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>

      <ul
        ref={menuRef}
        id="nav-menu"
        className={`nav-links ${menuOpen ? "active" : ""}`}
        role="menu"
        aria-hidden={!isMobile ? false : !menuOpen}
      >
        <li role="none">
          <Link
            to="/"
            onClick={closeMenu}
            role="menuitem"
            tabIndex={isMobile && !menuOpen ? -1 : 0}
          >
            Home
          </Link>
        </li>
        <li role="none">
          <Link
            to="/features"
            onClick={closeMenu}
            role="menuitem"
            tabIndex={isMobile && !menuOpen ? -1 : 0}
          >
            Features
          </Link>
        </li>
        <li role="none">
          <Link
            to="/dashboard"
            onClick={closeMenu}
            role="menuitem"
            tabIndex={isMobile && !menuOpen ? -1 : 0}
          >
            Dashboard
          </Link>
        </li>
        <li role="none">
          <Link
            to="/contact"
            onClick={closeMenu}
            role="menuitem"
            tabIndex={isMobile && !menuOpen ? -1 : 0}
          >
            Contact
          </Link>
        </li>
        {token ? (
          <li role="none">
            <button
              className="auth-btn"
              onClick={handleLogout}
              role="menuitem"
              tabIndex={isMobile && !menuOpen ? -1 : 0}
              aria-label="Logout from your account"
            >
              Logout
            </button>
          </li>
        ) : (
          <li role="none">
            <Link
              className="auth-btn"
              to="/auth"
              onClick={closeMenu}
              role="menuitem"
              tabIndex={isMobile && !menuOpen ? -1 : 0}
              aria-label="Login or register for an account"
            >
              Login/Register
            </Link>
          </li>
        )}
      </ul>

      {/* Mobile menu backdrop with improved accessibility */}
      {menuOpen && (
        <div
          className="menu-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
          role="presentation"
        ></div>
      )}
    </nav>
  );
}
