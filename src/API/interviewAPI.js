// frontend/src/API/interviewAPI.js
import axios from "axios";
const API_URL = "http://localhost:5000/api/interview";

export const fetchInterviewQuestions = async (jobTitle, token, round) => {
  const res = await axios.post(`${API_URL}/questions`, { jobTitle, round }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // { questions, category, round }
};

export const evaluateAnswers = async (answers, jobTitle, round, token) => {
  const res = await axios.post(`${API_URL}/evaluate`, { answers, jobTitle, round }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // { evaluation: [...] }
};

export const submitFinalResult = async (payload, token) => {
  const res = await axios.post(`${API_URL}/submit`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const fetchUserResults = async (token) => {
  const res = await axios.get(`${API_URL}/results`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // { results: [...] }
};

// profile
export const fetchUserProfile = async (token) => {
  const res = await axios.get(`http://localhost:5000/api/users/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // { user }
};
