import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Landmark,
  Cpu,
  Code2,
  Briefcase,
  TrendingUp,
  Palette,
  HeartPulse,
  GraduationCap,
  Scale,
  Megaphone,
} from "lucide-react";

import { getInterestOptions, saveStudentInterest } from "../../services/studentService";
import "./InterestPlus.css";

const INTEREST_DETAILS_MAP = {
  "Government & Public Services": {
    id: "government-public-services",
    title: "Government & Public Services",
    description: "Civil services, governance, policy administration and public sector",
    icon: Landmark,
  },
  "IT & Technology": {
    id: "it-technology",
    title: "IT & Technology",
    description: "Cloud computing, network infrastructure, IT systems and cybersecurity",
    icon: Cpu,
  },
  "Coding & Software": {
    id: "coding-software",
    title: "Coding & Software",
    description: "Software engineering, web development, algorithms and system architecture",
    icon: Code2,
  },
  "Business & Entrepreneurship": {
    id: "business-entrepreneurship",
    title: "Business & Entrepreneurship",
    description: "Startups, business strategy, product leadership and management",
    icon: Briefcase,
  },
  "Finance": {
    id: "finance",
    title: "Finance",
    description: "Financial markets, investment analysis, banking and wealth management",
    icon: TrendingUp,
  },
  "Creative & Media": {
    id: "creative-media",
    title: "Creative & Media",
    description: "Digital design, media production, visual creativity and content creation",
    icon: Palette,
  },
  "Healthcare": {
    id: "healthcare",
    title: "Healthcare",
    description: "Medical sciences, biotechnology, health informatics and clinical care",
    icon: HeartPulse,
  },
  "Education": {
    id: "education",
    title: "Education",
    description: "Academic teaching, educational technology, pedagogy and research",
    icon: GraduationCap,
  },
  "Law": {
    id: "law",
    title: "Law",
    description: "Legal studies, corporate compliance, intellectual property and advocacy",
    icon: Scale,
  },
  "Marketing": {
    id: "marketing",
    title: "Marketing",
    description: "Brand strategy, digital marketing, consumer insights and growth",
    icon: Megaphone,
  },
};

const DEFAULT_OPTIONS = [
  "Government & Public Services",
  "IT & Technology",
  "Coding & Software",
  "Business & Entrepreneurship",
  "Finance",
  "Creative & Media",
  "Healthcare",
  "Education",
  "Law",
  "Marketing",
];

function buildInterestItem(title) {
  if (INTEREST_DETAILS_MAP[title]) {
    return INTEREST_DETAILS_MAP[title];
  }
  return {
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title,
    description: `Explore pathways, roles and skills in ${title}`,
    icon: Sparkles,
  };
}

function InterestPlus() {
  const navigate = useNavigate();

  const [availableInterests, setAvailableInterests] = useState(() =>
    DEFAULT_OPTIONS.map(buildInterestItem)
  );
  const [selectedInterests, setSelectedInterests] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getInterestOptions()
      .then((options) => {
        if (isMounted && Array.isArray(options) && options.length > 0) {
          setAvailableInterests(options.map(buildInterestItem));
        }
      })
      .catch((err) => {
        console.warn("Could not load dynamic interest options:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleInterest = (interestTitle) => {
    setSelectedInterests((current) => {
      if (current.includes(interestTitle)) {
        return current.filter((title) => title !== interestTitle);
      }

      return [...current, interestTitle];
    });
  };

  const handleContinue = async () => {
    if (selectedInterests.length === 0) {
      return;
    }

    const primaryTitle = selectedInterests[0];

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
            {availableInterests.map((interest) => {
              const Icon = interest.icon;

              const isSelected = selectedInterests.includes(interest.title);

              return (
                <button
                  key={interest.id}
                  type="button"
                  className={`interest-option ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleInterest(interest.title)}
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
