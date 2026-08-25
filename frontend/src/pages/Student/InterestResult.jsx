import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Mic,
  Puzzle,
  Target,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

import "./InterestResult.css";

function InterestResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedInterests = location.state?.selectedInterests || [
    "public-speaking",
  ];

  const answers = location.state?.answers || {};

  /*
   * TEMPORARY ANALYSIS
   *
   * These values are intentionally calculated on the frontend
   * only for the prototype.
   *
   * Later:
   *
   * Frontend → FastAPI → AI → FastAPI → Frontend
   */

  const interestLevel = Number(answers["interest-level"] || 4);
  const ability = Number(answers["ability"] || 2);

  const interestScore = interestLevel * 20;
  const capabilityScore = ability * 20;

  const experienceAnswer = answers["experience"] || [];

  const hasExperience =
    Array.isArray(experienceAnswer) &&
    experienceAnswer.length > 0 &&
    !experienceAnswer.includes("none");

  const experienceScore = hasExperience ? 60 : 20;

  const primaryInterest = selectedInterests[0];

  const interestName = primaryInterest
    .replace("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const getAnalysis = () => {
    if (interestScore >= 80 && capabilityScore < 60) {
      return `You show strong interest in ${interestName}, while your current capability is still developing. This is a good area to explore further through practical experiences.`;
    }

    if (interestScore >= 80 && capabilityScore >= 60) {
      return `You show both strong interest and developing capability in ${interestName}. Continued practical experience could help you build this further.`;
    }

    if (interestScore < 60) {
      return `Your responses suggest that ${interestName} is something you may want to explore further before deciding how strongly it fits you.`;
    }

    return `Your responses show a developing interest in ${interestName}. More practical exposure can help you understand whether you want to pursue it further.`;
  };

  const getSkillGaps = () => {
    if (primaryInterest === "public-speaking") {
      const gaps = [];

      if (capabilityScore < 60) {
        gaps.push("Public Speaking Confidence");
      }

      if (!hasExperience) {
        gaps.push("Practical Speaking Experience");
      }

      gaps.push("Audience Engagement");
      gaps.push("Presentation Skills");

      return gaps.slice(0, 4);
    }

    return ["Practical Experience", "Communication", "Problem Solving"];
  };

  const getDirections = () => {
    if (primaryInterest === "public-speaking") {
      return [
        {
          icon: Mic,
          title: "Event Hosting",
          score: 91,
        },
        {
          icon: Target,
          title: "Public Relations",
          score: 84,
        },
        {
          icon: TrendingUp,
          title: "Content Creation",
          score: 78,
        },
      ];
    }

    return [
      {
        icon: Target,
        title: "Explore this area further",
        score: 82,
      },
      {
        icon: TrendingUp,
        title: "Build practical experience",
        score: 76,
      },
    ];
  };

  const skillGaps = getSkillGaps();
  const directions = getDirections();

  return (
    <div className="interest-result-page">
      <header className="result-header">
        <button
          className="result-back"
          onClick={() => navigate("/student/dashboard")}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>

        <div className="result-brand">
          <Sparkles size={18} />
          Interest+
        </div>

        <span className="result-complete">
          <CheckCircle2 size={15} />
          Discovery complete
        </span>
      </header>

      <main className="result-main">
        {/* Heading */}

        <section className="result-intro">
          <span className="result-eyebrow">YOUR INTEREST PROFILE</span>

          <h1>
            Here's what we learned
            <br />
            about you.
          </h1>

          <p>
            This isn't a final career decision. It's a snapshot of your current
            interests, experience and areas worth exploring.
          </p>
        </section>

        {/* Main interest */}

        <section className="main-interest-card">
          <div className="main-interest-heading">
            <div className="main-interest-icon">
              <Mic size={25} />
            </div>

            <div>
              <span>PRIMARY INTEREST</span>
              <h2>{interestName}</h2>
            </div>
          </div>

          <div className="score-grid">
            <div className="score-item">
              <div className="score-title">
                <span>Interest</span>
                <strong>{interestScore}%</strong>
              </div>

              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${interestScore}%`,
                  }}
                />
              </div>
            </div>

            <div className="score-item">
              <div className="score-title">
                <span>Current Capability</span>
                <strong>{capabilityScore}%</strong>
              </div>

              <div className="score-bar">
                <div
                  className="score-fill capability"
                  style={{
                    width: `${capabilityScore}%`,
                  }}
                />
              </div>
            </div>

            <div className="score-item">
              <div className="score-title">
                <span>Experience</span>
                <strong>{experienceScore}%</strong>
              </div>

              <div className="score-bar">
                <div
                  className="score-fill experience"
                  style={{
                    width: `${experienceScore}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Analysis */}

        <section className="analysis-card">
          <div className="analysis-icon">
            <Sparkles size={21} />
          </div>

          <div>
            <span className="result-section-label">OUR ANALYSIS</span>

            <p>{getAnalysis()}</p>
          </div>
        </section>

        {/* Two-column section */}

        <section className="result-two-column">
          {/* Skill gaps */}

          <div className="result-panel">
            <div className="panel-heading">
              <div className="panel-icon">
                <Puzzle size={20} />
              </div>

              <div>
                <span>DEVELOPMENT AREAS</span>
                <h2>Skills to develop</h2>
              </div>
            </div>

            <div className="skill-list">
              {skillGaps.map((skill) => (
                <div className="skill-item" key={skill}>
                  <span>{skill}</span>
                  <ArrowRight size={15} />
                </div>
              ))}
            </div>
          </div>

          {/* Directions */}

          <div className="result-panel">
            <div className="panel-heading">
              <div className="panel-icon">
                <Target size={20} />
              </div>

              <div>
                <span>AREAS TO EXPLORE</span>
                <h2>Potential directions</h2>
              </div>
            </div>

            <div className="direction-list">
              {directions.map((direction) => {
                const Icon = direction.icon;

                return (
                  <div className="direction-item" key={direction.title}>
                    <div className="direction-icon">
                      <Icon size={17} />
                    </div>

                    <div className="direction-info">
                      <strong>{direction.title}</strong>

                      <div className="direction-score">
                        <div>
                          <div
                            className="direction-score-fill"
                            style={{
                              width: `${direction.score}%`,
                            }}
                          />
                        </div>

                        <span>{direction.score}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer */}

        <section className="result-footer-card">
          <div>
            <span className="result-section-label">WHAT'S NEXT?</span>

            <h2>Your interest profile can evolve.</h2>

            <p>
              Explore opportunities, identify skill gaps and update your
              interests as you gain new experiences.
            </p>
          </div>

          <button
            className="profile-button"
            onClick={() => navigate("/student/dashboard")}
          >
            Go to Dashboard
            <ArrowRight size={17} />
          </button>
        </section>
      </main>
    </div>
  );
}

export default InterestResult;
