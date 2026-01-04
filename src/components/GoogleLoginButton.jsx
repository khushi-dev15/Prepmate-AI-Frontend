// src/components/GoogleLoginButton.jsx
import React from "react";

const GoogleLoginButton = () => {
  const handleLogin = () => {
    // Redirect to backend Google OAuth route
    window.location.href = "https://prepmate-ai-backend.onrender.com/api/auth/google";
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        backgroundColor: "#4285F4",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;
