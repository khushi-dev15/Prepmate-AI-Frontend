// frontend/src/API/interviewAPI.js
import api from "./api";

// Fetch interview questions
export const fetchInterviewQuestions = async (jobTitle, jobDescription, round, token) => {
  const payload = { jobTitle, round };
  if (jobDescription) payload.jobDescription = jobDescription;
  const res = await api.post("/interview/questions", payload, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  return res.data;
};

// Evaluate answers
export const evaluateAnswers = async (answers, jobTitle, round, token) => {
  const payload = { answers, jobTitle, round };
  const res = await api.post("/interview/evaluate", payload, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  return res.data;
};

// Submit final result
export const submitFinalResult = async (payload) => {
  const res = await api.post("/interview/submit", payload);
  return res.data;
};

// Fetch user interview results
export const fetchUserResults = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/interview/results", { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  return res.data;
};

// User profile
export const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/users/profile", { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  return res.data;
};
