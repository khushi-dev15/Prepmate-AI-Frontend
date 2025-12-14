import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "./landing.css";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <section className="hero-section">
        <h1 className="hero-title">Your AI Interview Partner</h1>
        <p className="hero-subtitle">Practice | Improve | Succeed</p>
        <Link to="/auth">
          <button className="start-btn">Get Started</button>
        </Link>

        <div className="features">
          <div className="feature-card">
            <h3>AI Powered</h3>
            <p>Smart questions tailored to your resume & role.</p>
          </div>
          <div className="feature-card">
            <h3>Voice Analysis</h3>
            <p>Get instant feedback on tone, clarity & confidence.</p>
          </div>
          <div className="feature-card">
            <h3>Track Progress</h3>
            <p>View your scores & growth over time with insights.</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
