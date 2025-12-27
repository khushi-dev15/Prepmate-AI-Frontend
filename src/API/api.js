import axios from "axios";

// Use localhost in development, Render in production
const isDev = import.meta.env.DEV;
const baseURL = isDev ? "http://localhost:5000/api" : "https://prepmate-ai-backend-829s.onrender.com/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 120000
});

console.log("🌐 API Base URL (forced):", baseURL);

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log("📤 Request:", config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("📥 Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
