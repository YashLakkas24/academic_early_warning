import { useState } from "react";
import { CheckCircle2, Circle, CircleDot, ChevronDown } from "lucide-react";

const STATUS_ICON = {
  "in-progress": CircleDot,
  "not-started": Circle,
  done: CheckCircle2,
};

const STATUS_LABEL = {
  "in-progress": "In progress",
  "not-started": "Not started",
  done: "Done",
};

function RoadmapStep({ item, isOpen, onToggle }) {
  const StatusIcon = STATUS_ICON[item.status] ?? Circle;

  return (
    <li className={`roadmap-step ${isOpen ? "roadmap-step--open" : ""}`}>
      <button className="roadmap-step__head" onClick={onToggle} aria-expanded={isOpen}>
        <span className={`roadmap-step__status roadmap-step__status--${item.status}`}>
          <StatusIcon size={16} />
        </span>
        <div className="roadmap-step__heading">
          <span className="roadmap-step__n">Step {String(item.step).padStart(2, "0")}</span>
          <span className="roadmap-step__title">{item.title}</span>
        </div>
        <span className="roadmap-step__badge">{STATUS_LABEL[item.status] ?? item.status}</span>
        <ChevronDown size={16} className="roadmap-step__chevron" />
      </button>

      {isOpen && (
        <div className="roadmap-step__body">
          <p className="roadmap-step__desc">{item.description}</p>
          <div className="roadmap-step__grid">
            <div>
              <span className="roadmap-step__label">Skill being developed</span>
              <span className="roadmap-step__value">{item.skill}</span>
            </div>
            <div>
              <span className="roadmap-step__label">Suggested activity</span>
              <span className="roadmap-step__value">{item.activity}</span>
            </div>
            <div>
              <span className="roadmap-step__label">Estimated effort</span>
              <span className="roadmap-step__value">{item.effort}</span>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

function Roadmap({ steps, currentLabel, targetLabel, sectionRef }) {
  const [openStep, setOpenStep] = useState(steps[0]?.step ?? null);

  return (
    <div className="roadmap" ref={sectionRef}>
      <div className="roadmap__endpoints">
        <div className="roadmap__endpoint">
          <span className="roadmap__endpoint-label">Current</span>
          <span className="roadmap__endpoint-value">{currentLabel}</span>
        </div>
        <span className="roadmap__endpoint-arrow" aria-hidden="true" />
        <div className="roadmap__endpoint roadmap__endpoint--target">
          <span className="roadmap__endpoint-label">Target direction</span>
          <span className="roadmap__endpoint-value">{targetLabel}</span>
        </div>
      </div>

      <ol className="roadmap__steps">
        {steps.map((item) => (
          <RoadmapStep
            key={item.step}
            item={item}
            isOpen={openStep === item.step}
            onToggle={() => setOpenStep(openStep === item.step ? null : item.step)}
          />
        ))}
      </ol>
    </div>
  );
}

export default Roadmap;
