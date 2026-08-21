import { Users, LayoutGrid, ClipboardList, Clock, TrendingDown } from "lucide-react";
import SignalThread from "./SignalThread";

const STAGES = [
  { icon: <Users size={16} />, label: "Large student population" },
  { icon: <LayoutGrid size={16} />, label: "Scattered academic signals" },
  { icon: <ClipboardList size={16} />, label: "Difficult manual monitoring" },
  { icon: <Clock size={16} />, label: "Delayed intervention" },
  { icon: <TrendingDown size={16} />, label: "Student falls further behind" },
];

function ProblemSection() {
  return (
    <section className="problem" id="problem">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">The problem</span>
          <h2 className="section-title">
            The problem isn&apos;t a lack of data.
            <br />
            It&apos;s knowing when to act.
          </h2>
          <p className="section-sub">
            Faculty already manage multiple batches, attendance, internal assessments,
            assignments and performance records for large numbers of students — but spotting
            gradual academic decline by hand, across all of it, is genuinely difficult.
          </p>
        </div>

        <div className="problem__thread">
          <SignalThread stage="scattered" />
        </div>

        <ol className="problem__steps">
          {STAGES.map((stage, i) => (
            <li className="problem__step" key={stage.label}>
              <span className="problem__step-icon">{stage.icon}</span>
              <span className="problem__step-label">{stage.label}</span>
              {i < STAGES.length - 1 && <span className="problem__step-arrow" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default ProblemSection;
