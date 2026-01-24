import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import "./features.css";

// Chat data
const chatData = [
  { id: 1, sender: "ai", text: "Hi! I’m PrepMate AI, your personal interview partner 🤖" },
  { id: 2, sender: "user", text: "Awesome! How can you help me prepare?" },
  { id: 3, sender: "ai", text: "I evaluate your resume and give instant actionable feedback 📝" },
  { id: 4, sender: "user", text: "Can you generate interview questions too?" },
  { id: 5, sender: "ai", text: "Yes! Personalized questions tailored to your skills and job role 💡" },
  { id: 6, sender: "user", text: "Great! Can I track my progress?" },
  { id: 7, sender: "ai", text: "Absolutely! Track scores, trends, and improvement suggestions 📊" },
  { id: 8, sender: "ai", text: "Why choose PrepMate AI? Here’s why:" },
  { id: 9, sender: "ai", text: "✔ AI-powered personalized experience" },
  { id: 10, sender: "ai", text: "✔ Step-by-step preparation from resume to final interview" },
  { id: 11, sender: "ai", text: "✔ Real-time insights to improve skills & confidence" },
  { id: 12, sender: "ai", text: "✔ Lifetime tracking of progress and growth" },
  { id: 13, sender: "user", text: "Wow! Let’s get started then 🚀" },
];

// ErrorBoundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <h2 style={{ color: "#ff4d6d", textAlign: "center", marginTop: "2rem" }}>
          Something went wrong in Features Chat.
        </h2>
      );
    }
    return this.props.children;
  }
}

const CleanFeaturesChat = () => {
  const [visibleChats, setVisibleChats] = useState([]);
  const chatEndRef = useRef(null);

  // Reveal chats one by one
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < chatData.length) {
        setVisibleChats((prev) => [...prev, chatData[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom when new chat added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleChats]);

  return (
    <ErrorBoundary>
      <Navbar />
      <section className="clean-chat-section">
        <h1 className="chat-heading">Explore PrepMate AI Features</h1>
        <div className="chat-container">
          {visibleChats.map((chat) =>
            chat ? (
              <div
                key={chat.id}
                className={`chat-bubble ${chat.sender === "ai" ? "ai" : "user"}`}
              >
                {chat.text}
              </div>
            ) : null
          )}
          <div ref={chatEndRef} />
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default CleanFeaturesChat;
