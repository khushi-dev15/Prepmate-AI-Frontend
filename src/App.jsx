import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/landing";
import AuthPage from "./pages/auth";
import ResetPasswordPage from "./pages/reset-password";
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
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* Routes (protect pages requiring auth) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/contact" element={
          <ProtectedRoute>
            <ContactPage />
          </ProtectedRoute>
        } />

        {/* Home & Result Routes (protected) */}
        <Route path="/homepage" element={
          <ProtectedRoute>
            <HomePages />
          </ProtectedRoute>
        } />
        <Route path="/result" element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        } />
        <Route path="/final-result" element={
          <ProtectedRoute>
            <FinalResultPage />
          </ProtectedRoute>
        } />
        <Route path="/interview" element={
          <ProtectedRoute>
            <InterviewPage />
          </ProtectedRoute>
        } />

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
