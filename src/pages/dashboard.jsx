// frontend/src/pages/dashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchUserResults, fetchUserProfile } from "../API/interviewAPI";
import "./dashboard.css";

export default function DashboardPage() {
  const [results, setResults] = useState([]);
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      try {
        const [res, profileRes] = await Promise.all([
          fetchUserResults(token),
          fetchUserProfile(token)
        ]);
        setResults(res.results || []);
        setProfile(profileRes.user || null);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);
  return (
    <div className="dashboard-container">
      <h2 style={{ marginBottom: 12 }}>Your Dashboard</h2>

      {profile ? (
        <div className="dashboard-grid">
          <div className="profile-card">
            <h3>Profile</h3>
            <p><strong>Name:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><small>Joined: {new Date(profile.createdAt).toLocaleDateString()}</small></p>
          </div>

          <div>
            <section>
              <h3 style={{ marginBottom: 12 }}>Interview History</h3>
              {results.length === 0 && <div>No past results found.</div>}
              {results.map(r => (
                <div key={r._id} className="result-item">
                  <div>
                    <p style={{ margin: 0 }} className="result-meta"><strong>{r.jobTitle}</strong> <small>({r.category})</small></p>
                    <small className="result-meta">{new Date(r.createdAt).toLocaleString()}</small>
                  </div>
                  <div className="result-score">
                    <p style={{ margin: 0 }}><strong>Total:</strong> {r.totalScore}</p>
                    <p style={{ margin: 0 }}><small>TR: {r.trScore} | HR: {r.hrScore}</small></p>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      ) : (
        <div>Loading profile...</div>
      )}
    </div>
  );
}
