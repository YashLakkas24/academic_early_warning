import {
  Radar,
  LineChart,
  MessagesSquare,
  Compass,
  PuzzleIcon,
  BellRing,
} from "lucide-react";
import FeatureCard from "../../components/FeatureCard/FeatureCard";

function FeaturesSection() {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Platform capabilities</span>
          <h2 className="section-title">Built to explain risk, not just report scores.</h2>
          <p className="section-sub">
            Six capabilities, working together across teachers, students and parents.
          </p>
        </div>

        <div className="features__grid">
          {/* Primary — Early Risk Detection */}
          <FeatureCard
            index="01"
            size="hero"
            icon={<Radar size={22} />}
            title="Early risk detection"
            description="Identify students showing emerging academic risk using attendance, assessments and performance trends — flagged early, not after the fact."
            visual={
              <div className="risk-visual">
                <div className="risk-visual__bar">
                  <span className="risk-visual__seg risk-visual__seg--stable" style={{ flex: 42 }} />
                  <span className="risk-visual__seg risk-visual__seg--medium" style={{ flex: 13 }} />
                  <span className="risk-visual__seg risk-visual__seg--high" style={{ flex: 7 }} />
                </div>
                <div className="risk-visual__legend">
                  <span><i className="dot dot--success" />Stable · 42</span>
                  <span><i className="dot dot--warning" />Medium · 13</span>
                  <span><i className="dot dot--danger" />High · 07</span>
                </div>
              </div>
            }
          />

          {/* Secondary — Performance Intelligence */}
          <FeatureCard
            index="02"
            size="wide"
            accent="secondary"
            icon={<LineChart size={22} />}
            title="Performance intelligence"
            description="Go beyond the current mark and understand the student's academic trajectory across assessments."
            visual={
              <svg viewBox="0 0 220 46" className="trend-visual" role="presentation" aria-hidden="true">
                <polyline
                  points="4,34 40,30 76,36 112,20 148,24 184,10 216,14"
                  fill="none"
                  stroke="var(--color-secondary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="216" cy="14" r="3" fill="var(--color-secondary)" />
              </svg>
            }
          />

          <FeatureCard
            index="03"
            size="default"
            icon={<MessagesSquare size={20} />}
            title="AI-powered explanations"
            description="Understand the major factors contributing to a student's risk, explained in plain language."
          />

          <FeatureCard
            index="04"
            size="default"
            accent="secondary"
            icon={<Compass size={20} />}
            title="Career direction"
            description="Connect a student's interests, academic evidence and existing skills to potential career pathways."
          />

          <FeatureCard
            index="05"
            size="default"
            icon={<PuzzleIcon size={20} />}
            title="Skill-gap analysis"
            description="Identify relevant skill gaps against a chosen direction and suggest areas for development."
          />

          <FeatureCard
            index="06"
            size="default"
            accent="secondary"
            icon={<BellRing size={20} />}
            title="Parent intervention"
            description="Notify parents when sustained academic risk requires attention at home."
          />
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
