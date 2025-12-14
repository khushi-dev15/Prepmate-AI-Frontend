// src/pages/interview.jsx
import React, { useEffect, useState } from "react";
import { fetchInterviewQuestions, evaluateAnswers, submitFinalResult } from "../API/interviewAPI";
import { useNavigate } from "react-router-dom";
import "./interview.css";

export default function InterviewPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [inputAnswer, setInputAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [trEvaluation, setTrEvaluation] = useState(null);

  const navigate = useNavigate();

  // Read saved values
  const jobTitleStored = localStorage.getItem("jobTitle");
  const jobCategory = localStorage.getItem("jobCategory") || "Non-Technical";
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const initialRound = localStorage.getItem("interviewRound") || (jobCategory === "Technical" ? "TR" : "HR");
  const [round, setRound] = useState(initialRound);

  useEffect(() => {
    // Validate that resume + jobTitle exist
    const resumeUploaded = localStorage.getItem("resumeUploaded");
    if (!resumeUploaded || !jobTitleStored) {
      alert("Please login and upload resume first!");
      navigate("/homepage");
      return;
    }
    // load questions for the current round
    loadQuestions(round);
    // eslint-disable-next-line
  }, [round]);

  const loadQuestions = async (r) => {
    try {
      setLoading(true);
      // send both keys to be safe: backend accepts jobTitle or jobtitle
      const payloadJobTitle = jobTitleStored;
      const data = await fetchInterviewQuestions(payloadJobTitle, token, r);
      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setAnswers([]); // fresh answers each round
      setInputAnswer("");
      setLoading(false);
    } catch (err) {
      console.error("loadQuestions error:", err?.response?.data || err.message);
      alert("Failed to fetch questions: " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleNext = async () => {
    // Save current answer
    const updated = [...answers];
    updated[currentIndex] = inputAnswer;
    setAnswers(updated);
    setInputAnswer("");

    // If more questions in same round
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setInputAnswer(updated[currentIndex + 1] || "");
      return;
    }

    // Last question of round -> evaluate this round
    try {
      const evalRes = await evaluateAnswers(updated, jobTitleStored, round, token);
      // evalRes should be { evaluation: [ {score, feedback}, ... ] }
      const thisEvaluation = evalRes.evaluation || [];

      if (round === "TR") {
        // Save TR result and proceed to HR round
        setTrEvaluation(thisEvaluation);
        localStorage.setItem("interviewRound", "HR");
        setRound("HR");
        // loadQuestions will be triggered by useEffect on round change
      } else {
        // HR finished — submit both TR & HR to backend and show final result
        const payload = {
          userId,
          jobTitle: jobTitleStored,
          category: jobCategory,
          trEvaluation: trEvaluation || [],
          hrEvaluation: thisEvaluation
        };

        await submitFinalResult(payload, token);
        localStorage.removeItem("interviewRound");
        // navigate to final result page with evaluation arrays
        navigate("/final-result", { state: { jobTitle: jobTitleStored, jobCategory, trEvaluation: trEvaluation || [], hrEvaluation: thisEvaluation } });
      }
    } catch (err) {
      console.error("Evaluation error:", err?.response?.data || err.message);
      alert("Evaluation failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setInputAnswer(answers[currentIndex - 1] || "");
    } else {
      navigate("/homepage");
    }
  };

  if (loading) return <h2 className="loading-text">Loading questions...</h2>;
  if (!questions || questions.length === 0) return <h2 className="loading-text">No questions found!</h2>;

  return (
    <div className="interview-container">
      <h2>{round === "TR" ? "Technical Round" : "HR Round"} – {jobTitleStored}</h2>

      <div className="question-box">
        <h3>Q{currentIndex + 1}: {questions[currentIndex]}</h3>
        <textarea
          placeholder="Type your answer here..."
          value={inputAnswer}
          onChange={(e) => setInputAnswer(e.target.value)}
        />
      </div>

      <div className="button-group">
        <button onClick={handleBack}>Go Back</button>
        <button onClick={handleNext}>
          {currentIndex + 1 < questions.length ? "Next Question" : "Submit Round"}
        </button>
      </div>
    </div>
  );
}
