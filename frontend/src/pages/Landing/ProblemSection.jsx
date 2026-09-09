import { Users, LayoutGrid, ClipboardList, Clock, TrendingDown, HelpCircle, Compass, Wrench, Repeat, Map } from "lucide-react";
import SignalThread from "./SignalThread";

const ACADEMIC_STAGES = [
  { icon: <Users size={16} />, label: "Large student population" },
  { icon: <LayoutGrid size={16} />, label: "Scattered academic signals" },
  { icon: <ClipboardList size={16} />, label: "Difficult manual monitoring" },
  { icon: <Clock size={16} />, label: "Delayed intervention" },
  { icon: <TrendingDown size={16} />, label: "Student falls further behind" },
];

const DIRECTION_GAPS = [
  { icon: <Compass size={16} />, label: "What direction fits them" },
  { icon: <Wrench size={16} />, label: "What skills they already have" },
  { icon: <HelpCircle size={16} />, label: "What skills are missing" },
  { icon: <Repeat size={16} />, label: "Whether existing skills transfer" },
  { icon: <Map size={16} />, label: "What they should do next" },
];

function ProblemSection() {
  return (
    <section className="problem" id="problem">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">The problem</span>
          <h2 className="section-title">
            Students don&apos;t only need someone to notice
            <br />
            when they&apos;re falling behind.
          </h2>
          <p className="section-sub">
            E.A.R.N. exists because institutions face two connected problems — one about noticing
            risk early, and one about knowing what comes next.
          </p>
        </div>

        <div className="problem__grid">
          <div className="problem__block">
            <span className="problem__block-n">01</span>
            <h3 className="problem__block-title">Academic Risk</h3>
            <p className="problem__block-desc">
              Faculty manage attendance, internal assessments, assignments and performance
              records for large numbers of students — but spotting gradual academic decline by
              hand, across all of it, is genuinely difficult.
            </p>
            <div className="problem__thread">
              <SignalThread stage="scattered" />
            </div>
            <ol className="problem__steps">
              {ACADEMIC_STAGES.map((stage, i) => (
                <li className="problem__step" key={stage.label}>
                  <span className="problem__step-icon">{stage.icon}</span>
                  <span className="problem__step-label">{stage.label}</span>
                  {i < ACADEMIC_STAGES.length - 1 && (
                    <span className="problem__step-arrow" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="problem__block problem__block--nav">
            <span className="problem__block-n problem__block-n--nav">02</span>
            <h3 className="problem__block-title">Directional Uncertainty</h3>
            <p className="problem__block-desc">
              Students may already know what interests them without knowing what direction fits
              them, what skills they already have, what&apos;s missing, or what to do next.
            </p>
            <ul className="problem__gap-list">
              {DIRECTION_GAPS.map((gap) => (
                <li key={gap.label}>
                  <span className="problem__gap-icon">{gap.icon}</span>
                  {gap.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="problem__equation">
          <span>Scattered academic signals</span>
          <span className="problem__equation-op">+</span>
          <span>Unclear student direction</span>
          <span className="problem__equation-op">=</span>
          <span className="problem__equation-result">Delayed intervention &amp; unclear next steps</span>
        </div>
      </div>
    </section>
  );
}

export default ProblemSection;
