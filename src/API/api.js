import axios from "axios";

// Use localhost in dev, Render URL in prod
const isDev = import.meta.env.DEV;
// In development use localhost backend. In production prefer VITE_API_URL,
// but fall back to the known Render backend URL so cookies and CORS work
// when the environment variable is missing on the host.
const baseURL = isDev
  ? "http://localhost:5000/api"
  : (import.meta.env.VITE_API_URL || "https://prepmate-ai-backend.onrender.com/api");

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // ✅ cookies sent automatically
  timeout: 120000
});

axiosInstance.interceptors.request.use((config) => {
  // ✅ Remove localStorage token for cookie auth
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
