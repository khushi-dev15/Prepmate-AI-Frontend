import React, { useState } from "react";
import axios from "../API/api"; // make sure this path is correct
import { useNavigate } from "react-router-dom";
import "./home.css";

export default function HomePages() {
  const [jobTitle, setJobTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendMessage, setBackendMessage] = useState(null);
  const navigate = useNavigate();

  // Capitalize each word in job title
  const formatJobTitle = (title) =>
    title
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const handleFileChange = (e) => setResume(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobTitle || !resume) return alert("Please enter job title and upload a resume.");

    const normalizedJobTitle = formatJobTitle(jobTitle);
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobTitle", normalizedJobTitle);

    try {
      setLoading(true);
      const res = await axios.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("jobTitle", normalizedJobTitle);
      localStorage.setItem("resumeUploaded", "true");

      setBackendMessage(res.data.message || "Resume uploaded successfully!");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextFromModal = async () => {
    setBackendMessage(null);

    const jobTitleStored = localStorage.getItem("jobTitle");
    if (!jobTitleStored || !resume)
      return alert("Please upload a resume first!");

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobTitle", jobTitleStored);

    try {
      const res = await axios.post("/resume/process", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/result", { state: { resultData: res.data } });
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="homepage-container">
      <div className="form-container">
        <h2 className="form-title">Upload Your Resume</h2>

        <form className="upload-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Job Title (e.g. Software Developer)"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload & Start Evaluation"}
          </button>
        </form>

        {backendMessage && (
          <div className="modal-overlay">
            <div className="modal-card">
              <p>{backendMessage}</p>
              <button className="next-btn" onClick={handleNextFromModal}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
