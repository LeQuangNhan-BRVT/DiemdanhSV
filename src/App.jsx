import React, { useState } from "react";
import SignInTeacher from "./Components/Authenticate/SignInTeacher";
import SignInStudent from "./Components/Authenticate/SignInStudent";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("student");

  return (
    <div className="app-container">
      
      <div className="content">
        {activeTab === "teacher" ? <SignInTeacher /> : <SignInStudent />}
      </div>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "student" ? "active" : ""}`}
          onClick={() => setActiveTab("student")}
        >
          Student
        </button>
        <button
          className={`tab-button ${activeTab === "teacher" ? "active" : ""}`}
          onClick={() => setActiveTab("teacher")}
        >
          Teacher
        </button>
      </div>
    </div>
  );
}

export default App;
