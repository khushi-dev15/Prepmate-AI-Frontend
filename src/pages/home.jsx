import React, { useState, useEffect, useRef } from "react";
import axios from "../API/api"; // make sure this path is correct
import { useNavigate } from "react-router-dom";
import "./home.css";

export default function HomePages() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [backendMessage, setBackendMessage] = useState(null);
  const [error, setError] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Capitalize each word in job title
  const formatJobTitle = (title) =>
    title
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      setResume(null);
      return;
    }
    setError(null);
    setResume(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!jobTitle || !resume) {
      setError("Please enter job title and upload a resume.");
      return;
    }

    const normalizedJobTitle = formatJobTitle(jobTitle);
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobTitle", normalizedJobTitle);
    if (jobDescription && jobDescription.trim()) formData.append("jobDescription", jobDescription.trim());

    try {
      setLoading(true);
      const res = await axios.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000 // 30 second timeout
      });

      if (res.data.success) {
        setResumeId(res.data.resumeId);
        localStorage.setItem("jobTitle", normalizedJobTitle);
        if (jobDescription && jobDescription.trim()) localStorage.setItem("jobDescription", jobDescription.trim());
        localStorage.setItem("resumeId", res.data.resumeId);
        localStorage.setItem("resumeUploaded", "true");
        // Automatically proceed to processing and show result (skip Next/modal)
        await handleNextFromModal();
      } else {
        setError(res.data.message || "Failed to upload resume");
      }
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Error uploading resume";
      setError(errorMsg);
      setBackendMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNextFromModal = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setError(null);

    const jobTitleStored = localStorage.getItem("jobTitle");
    const storedResumeId = localStorage.getItem("resumeId");

    // allow proceeding if we have a stored resumeId even when the file input is cleared
    if (!jobTitleStored || (!resume && !storedResumeId)) {
      setError("Please upload a resume first!");
      return;
    }

    const formData = new FormData();
    if (resume) formData.append("resume", resume);
    formData.append("jobTitle", jobTitleStored);
    const jobDescStored = localStorage.getItem("jobDescription") || jobDescription || "";
    if (jobDescStored) formData.append("jobDescription", jobDescStored);
    if (storedResumeId) {
      formData.append("resumeId", storedResumeId);
    }

    console.log("🔍 Sending to /resume/process:", {
      jobTitle: jobTitleStored,
      resumeFile: resume?.name,
      resumeId: storedResumeId
    });

    try {
      setProcessing(true);
      // blur file input to avoid accidental file dialog reopening
      try {
        if (fileInputRef && fileInputRef.current) {
          fileInputRef.current.blur();
        }
      } catch (blurErr) {
        // ignore
      }
      const res = await axios.post("/resume/process", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000 // 120 second timeout for processing
      });

      console.log("✅ Process response:", res.data);

      if (res.data.success) {
        setBackendMessage(null);
        navigate("/result", { state: { resultData: res.data } });
      } else {
        setError(res.data.message || "Failed to process resume");
      }
    } catch (err) {
      console.error("❌ Process error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Error processing resume";
      setError(errorMsg);
      setBackendMessage(null);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="homepage-container">
      <div className="form-container">
        <h2 className="form-title">Upload Your Resume</h2>

        {error && <div className="error-message">{error}</div>}

        <form className="upload-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Job Title (e.g. Software Developer)"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            disabled={loading || processing}
            required
          />

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={loading || processing || !!backendMessage}
            required={!backendMessage}
          />

          {resume && <p className="file-info">📄 {resume.name}</p>}

          <button 
            type="submit" 
            disabled={loading || processing || !jobTitle || !resume}
            className="submit-btn"
          >
            {loading ? "⏳ Uploading..." : "Upload & Start Evaluation"}
          </button>
        </form>

        {/* Modal/Next removed: processing now starts automatically after upload */}
      </div>
    </div>
  );
}
