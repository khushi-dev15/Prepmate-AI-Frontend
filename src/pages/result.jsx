import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./result.css";

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const resultData = state?.resultData;

  if (!resultData) {
    navigate("/homepage");
    return null;
  }

  const handleStartInterview = () => {
    localStorage.setItem("jobTitle", resultData.jobTitle);
    localStorage.setItem("jobCategory", resultData.category || "Non-Technical");
    // Start with Technical round if job is technical, otherwise start HR directly
    localStorage.setItem("interviewRound", resultData.category === "Technical" ? "TR" : "HR");
    navigate("/interview");
  };

  return (
    <div className="result-container">
      <div className="result-card">
        <h2>✅ Resume Evaluation Complete</h2>

        <p><strong>Job Role:</strong> {resultData.jobTitle}</p>
        <p><strong>Category:</strong> {resultData.category}</p>
        <p><strong>ATS Score:</strong> {resultData.atsScoreNormalized ?? Math.round((resultData.atsScore||0)/10)}/10</p>
        <p><strong>ATS Match:</strong> {resultData.matchPercent ?? resultData.atsScore}%</p>
        <p><strong>Suggestions:</strong></p>
        <ul>
          {(resultData.suggestions || []).map((s, i) => <li key={i}>{s}</li>)}
        </ul>

        <div className="button-group">
          <button className="secondary-btn" onClick={() => navigate("/homepage")}>
            Back
          </button>
          <button className="primary-btn" onClick={handleStartInterview}>
            Start Interview 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
