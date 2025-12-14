import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/landing";
import AuthPage from "./pages/auth";
import HomePages from "./pages/home";
import FeaturePage from "./pages/features";
import DashboardPage from "./pages/dashboard"; // ✅ Correct import
import ContactPage from "./pages/contact";
import ResultPage from "./pages/result";
import InterviewPage from "./pages/interview";
import FinalResultPage from "./pages/finalresult";
import ProtectedRoute from "./components/protectedRoutes"; 

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Home & Result Routes */}
        <Route path="/homepage" element={<HomePages />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/final-result" element={<FinalResultPage />} />
        <Route path="/interview" element={<InterviewPage />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/features"
          element={
            <ProtectedRoute>
              <FeaturePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
