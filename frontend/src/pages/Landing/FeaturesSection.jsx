import {
  Radar,
  LineChart,
  MessagesSquare,
  Sparkles,
  Compass,
  PuzzleIcon,
  Repeat,
  Map,
} from "lucide-react";
import FeatureCard from "../../components/FeatureCard/FeatureCard";

function FeaturesSection() {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Platform capabilities</span>
          <h2 className="section-title">Two intelligence layers, one platform.</h2>
          <p className="section-sub">
            Academic Risk Intelligence and Student Navigation Intelligence, working together
            across teachers, students and parents.
          </p>
        </div>

        <div className="features__grid">
          {/* Row 1: hero(4) + compact-2(2) = 6 */}
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
          <FeatureCard
            index="03"
            size="compact-2"
            icon={<MessagesSquare size={20} />}
            title="AI risk explanation"
            description="Explain why a student may be flagged, in plain, understandable language."
          />

          {/* Row 2: wide(3) + wide(3) = 6 */}
          <FeatureCard
            index="02"
            size="wide"
            accent="secondary"
            icon={<LineChart size={22} />}
            title="Performance intelligence"
            description="Understand a student's academic trajectory rather than isolated marks."
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
            index="04"
            size="wide"
            accent="nav"
            icon={<Sparkles size={22} />}
            title="Adaptive interest discovery"
            description="Dynamically understand a student's interests through up to 5 adaptive questions — no fixed questionnaire."
          />

          {/* Row 3: compact-3 + compact-3 = 6 */}
          <FeatureCard
            index="05"
            size="compact-3"
            accent="nav"
            icon={<Compass size={20} />}
            title="Career direction"
            description="Identify potential directions based on interest, evidence and existing skills."
          />
          <FeatureCard
            index="06"
            size="compact-3"
            accent="nav"
            icon={<PuzzleIcon size={20} />}
            title="Skill-gap intelligence"
            description="Compare current capabilities with what a selected direction actually requires."
          />

          {/* Row 4: compact-3 + compact-3 = 6 */}
          <FeatureCard
            index="07"
            size="compact-3"
            accent="nav"
            icon={<Repeat size={20} />}
            title="Transferable skill discovery"
            description="Identify existing skills that can support a transition into a new direction."
          />
          <FeatureCard
            index="08"
            size="compact-3"
            accent="nav"
            icon={<Map size={20} />}
            title="Personalized roadmap"
            description="Turn insights into a practical, step-by-step plan of what to do next."
          />
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
