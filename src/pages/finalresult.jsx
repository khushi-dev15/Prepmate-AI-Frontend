// frontend/src/pages/finalResult.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./finalresult.css";

export default function FinalResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const jobTitle = state?.jobTitle;
  const jobCategory = state?.jobCategory;
  const trEvaluation = state?.trEvaluation || [];
  const hrEvaluation = state?.hrEvaluation || [];

  if (!jobTitle) {
    navigate("/homepage");
    return null;
  }

  const sum = arr => arr.reduce((s, a) => s + (a.score || 0), 0);
  const trTotal = sum(trEvaluation);
  const hrTotal = sum(hrEvaluation);
  const maxPerRound = Math.max( (trEvaluation.length || 0) * 10, (hrEvaluation.length || 0) * 10 );
  const overall = trTotal + hrTotal;

  return (
    <div className="final-result-container">
      <div className="final-result-card">
        <h2>Final Interview Result</h2>
        <p><strong>Role:</strong> {jobTitle}</p>
        <p><strong>Category:</strong> {jobCategory}</p>

        {trEvaluation.length > 0 && (
          <div className="round-block">
            <h3>Technical Round</h3>
            <p className="round-score">Score: {trTotal} / {trEvaluation.length * 10}</p>
            <ul>
              {trEvaluation.map((e, i) => (
                <li key={i}><strong>Q{i+1}:</strong> Score {e.score} — {e.feedback}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="round-block">
          <h3>HR Round</h3>
          <p className="round-score">Score: {hrTotal} / {hrEvaluation.length * 10}</p>
          <ul>
            {hrEvaluation.map((e, i) => (
              <li key={i}><strong>Q{i+1}:</strong> Score {e.score} — {e.feedback}</li>
            ))}
          </ul>
        </div>

        <div className="summary-block">
          <h3>Overall</h3>
          <p className="overall-score">Total: {overall} / {trEvaluation.length * 10 + hrEvaluation.length * 10}</p>
        </div>

        <div className="final-actions">
          <button onClick={() => navigate("/homepage")}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}
