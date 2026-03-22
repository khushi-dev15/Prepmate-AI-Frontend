import axios from "axios";

// Use localhost in dev, Render URL in prod
const isDev = import.meta.env.DEV;

// In development use localhost backend. In production use Render backend URL
const baseURL = isDev
  ? "http://localhost:5000/api" // local dev
  : (import.meta.env.VITE_API_URL || "https://prepmate-ai-backend-829s.onrender.com/api"); // Render backend

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // ✅ cookies sent automatically
  timeout: 120000
});

axiosInstance.interceptors.request.use((config) => {
  const localToken = localStorage.getItem("token");
  if (localToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${localToken}`,
    };
  }

  // diagnostic logs
  console.log("📤 Request:", config.method?.toUpperCase(), config.baseURL + config.url);
  if (localToken) console.log("📤 Authorization: Bearer token added from localStorage");
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
