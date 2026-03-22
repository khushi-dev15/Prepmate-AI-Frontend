import React, { useState } from "react";
import axios from "../API/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import "./auth.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let response;

      // LOGIN
      if (isLogin) {
        response = await axios.post("/users/login", { email, password });
        alert("Login Successful!");
      }

      // REGISTER
      else {
        response = await axios.post("/users/register", {
          username,
          email,
          password
        });
        alert("Registration Successful!");
      }

      // READ DATA
      console.log("RESPONSE →", response.data);

      // SAVE TOKEN IF EXISTS
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      const userData = response.data.user || response.data;
      if (userData) {
        login(userData);
      }

      navigate("/homepage");
    } catch (err) {
      console.error("ERR →", err);
      const message = err.response?.data?.message || err.message || "Something went wrong!";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message" role="alert" style={{marginBottom:'10px', color:'#ff8fa5'}}>{error}</div>}
          {!isLogin && (
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="6"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="toggle-link"
            onClick={() => setIsLogin(!isLogin)}
            style={{ cursor: "pointer" }}
          >
            {isLogin ? "Register here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
}
