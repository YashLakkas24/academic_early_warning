import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Mic,
  Code2,
  Gamepad2,
  BarChart3,
  Palette,
  Briefcase,
  FlaskConical,
  Users,
} from "lucide-react";

import { saveStudentInterest } from "../../services/studentService";
import "./InterestPlus.css";

const interests = [
  {
    id: "public-speaking",
    title: "Public Speaking",
    description: "Speaking, presenting, debating and communicating",
    icon: Mic,
  },
  {
    id: "technology",
    title: "Technology",
    description: "Programming, software and emerging technologies",
    icon: Code2,
  },
  {
    id: "gaming",
    title: "Gaming",
    description: "Game development, game design and interactive experiences",
    icon: Gamepad2,
  },
  {
    id: "analytics",
    title: "Data & Analytics",
    description: "Data, statistics, patterns and problem solving",
    icon: BarChart3,
  },
  {
    id: "creativity",
    title: "Creativity & Design",
    description: "Design, visual creativity and creative expression",
    icon: Palette,
  },
  {
    id: "business",
    title: "Business",
    description: "Entrepreneurship, marketing and management",
    icon: Briefcase,
  },
  {
    id: "research",
    title: "Research",
    description: "Investigation, experimentation and discovery",
    icon: FlaskConical,
  },
  {
    id: "leadership",
    title: "Leadership",
    description: "Teamwork, coordination and decision making",
    icon: Users,
  },
];

function InterestPlus() {
  const navigate = useNavigate();

  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (interestId) => {
    setSelectedInterests((current) => {
      if (current.includes(interestId)) {
        return current.filter((id) => id !== interestId);
      }

      return [...current, interestId];
    });
  };

  const handleContinue = async () => {
    if (selectedInterests.length === 0) {
      return;
    }

    const selectedObj = interests.find((item) => item.id === selectedInterests[0]);
    const primaryTitle = selectedObj?.title || selectedInterests[0];

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const studentId = user.student_id || user.user_id || "STU001";
      await saveStudentInterest(studentId, primaryTitle);
    } catch (err) {
      console.warn("Failed to persist interest immediately, continuing:", err);
    }

    navigate("/student/interest/questions", {
      state: {
        selectedInterests,
        primaryInterest: primaryTitle,
      },
    });
  };

  return (
    <div className="interest-plus-page">
      <header className="interest-plus-header">
        <button
          className="back-button"
          onClick={() => navigate("/student/dashboard")}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>

        <div className="interest-plus-brand">
          <Sparkles size={19} />
          <span>Interest+</span>
        </div>

        <div className="interest-step">Step 1 of 3</div>
      </header>

      <main className="interest-plus-content">
        <div className="interest-intro">
          <div className="interest-main-icon">
            <Sparkles size={28} />
          </div>

          <span className="interest-eyebrow">INTEREST DISCOVERY</span>

          <h1>
            What genuinely
            <br />
            interests you?
          </h1>

          <p>
            Select the areas you are curious about. There are no right or wrong
            answers. Your choices will help us ask more relevant questions
            later.
          </p>
        </div>

        <div className="interest-selection">
          <div className="selection-heading">
            <div>
              <h2>Select your interests</h2>
              <span>You can choose more than one.</span>
            </div>

            <span className="selection-count">
              {selectedInterests.length} selected
            </span>
          </div>

          <div className="interest-options">
            {interests.map((interest) => {
              const Icon = interest.icon;

              const isSelected = selectedInterests.includes(interest.id);

              return (
                <button
                  key={interest.id}
                  className={`interest-option ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleInterest(interest.id)}
                >
                  <div className="interest-option-icon">
                    <Icon size={22} />
                  </div>

                  <div className="interest-option-text">
                    <strong>{interest.title}</strong>

                    <span>{interest.description}</span>
                  </div>

                  <div className="interest-check">{isSelected ? "✓" : ""}</div>
                </button>
              );
            })}
          </div>

          <div className="interest-bottom">
            <span>
              We'll explore your selections through adaptive questions.
            </span>

            <button
              className="continue-button"
              disabled={selectedInterests.length === 0}
              onClick={handleContinue}
            >
              Continue
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InterestPlus;
