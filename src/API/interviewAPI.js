// frontend/src/API/interviewAPI.js
import api from "./api";

// Fetch interview questions
export const fetchInterviewQuestions = async (jobTitle, jobDescription, round) => {
  const payload = { jobTitle, round };
  if (jobDescription) payload.jobDescription = jobDescription;
  const res = await api.post("/interview/questions", payload);
  return res.data;
};

// Evaluate answers
export const evaluateAnswers = async (answers, jobTitle, round) => {
  const payload = { answers, jobTitle, round };
  const res = await api.post("/interview/evaluate", payload);
  return res.data;
};

// Submit final result
export const submitFinalResult = async (payload) => {
  const res = await api.post("/interview/submit", payload);
  return res.data;
};

// Fetch user interview results
export const fetchUserResults = async () => {
  const res = await api.get("/interview/results");
  return res.data;
};

// User profile
export const fetchUserProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data;
};
