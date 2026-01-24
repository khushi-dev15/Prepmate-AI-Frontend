import React, { useState, useEffect } from "react";
import axios from "../API/api";
import { useNavigate } from "react-router-dom";
import "./auth.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const navigate = useNavigate();

  // Handle Google OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const success = params.get("success");

    if (token && success === "true") {
      localStorage.setItem("token", token);
      alert("Google login successful!");
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      navigate("/home");
    } catch (err) {
      console.error("ERR →", err);
      alert(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Redirect to backend Google OAuth endpoint
      window.location.href = "/api/auth/google";
    } catch (err) {
      console.error(err);
      alert("Google login not available at the moment");
    }
  };

  const handleForgotSubmit = async (e) => {
    e && e.preventDefault();
    if (!forgotEmail) return alert("Please enter your email");
    try {
      setLoading(true);
      const res = await axios.post("/users/forgot-password", { email: forgotEmail });
      alert(res.data.message || "If the email exists, a reset link was sent.");
      setShowForgot(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to send reset email (backend may not support this yet).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <input
              type="text"
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

        <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="google-btn" onClick={handleGoogleLogin} style={{ padding: '8px 12px' }}>
            Continue with Google
          </button>
          <button className="link-btn" onClick={() => setShowForgot(true)} style={{ padding: '8px 12px' }}>
            Forgot Password?
          </button>
        </div>

        {showForgot && (
          <div className="forgot-modal">
            <div className="forgot-card">
              <h3>Reset Password</h3>
              <form onSubmit={handleForgotSubmit}>
                <input type="email" placeholder="Enter your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button type="submit" disabled={loading}>Send Reset</button>
                  <button type="button" onClick={() => setShowForgot(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

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
