import { useState } from "react";
import { Check, Circle, CircleDot, ArrowRight, Target } from "lucide-react";
import Button from "../../../components/Button/Button";

const TABS = [
  { id: "assessment", label: "Skill Assessment" },
  { id: "transferable", label: "Transferable Skills" },
  { id: "gap", label: "Skill Gap" },
];

function SkillAssessmentView({ assessment }) {
  return (
    <div className="skill-assessment">
      <div className="skill-assessment__col skill-assessment__col--have">
        <span className="skill-assessment__col-label">
          <Check size={13} /> Already have
        </span>
        <ul>
          {assessment.alreadyHave.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
      <div className="skill-assessment__col skill-assessment__col--developing">
        <span className="skill-assessment__col-label">
          <CircleDot size={13} /> Developing
        </span>
        <ul>
          {assessment.developing.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
      <div className="skill-assessment__col skill-assessment__col--need">
        <span className="skill-assessment__col-label">
          <Circle size={13} /> Need to build
        </span>
        <ul>
          {assessment.needToBuild.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TransferableSkillsView({ items, directionName }) {
  return (
    <div className="transfer-map">
      <p className="transfer-map__intro">
        Changing direction doesn&apos;t mean starting from zero. Here&apos;s what already carries
        over toward <strong>{directionName}</strong>.
      </p>
      <div className="transfer-map__rows">
        {items.map((item) => (
          <div className="transfer-row" key={item.skill}>
            <div className="transfer-row__source">
              <span className="transfer-row__skill">{item.skill}</span>
              <span className="transfer-row__context">{item.sourceContext}</span>
            </div>
            <ArrowRight size={16} className="transfer-row__arrow" />
            <div className="transfer-row__target">
              <span className="transfer-row__skill transfer-row__skill--target">{item.transferableTo}</span>
              <span className="transfer-row__explanation">{item.explanation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillGapView({ gaps, onBuildRoadmap }) {
  const priority = gaps.filter((g) => g.priority);
  return (
    <div className="skill-gap">
      <div className="skill-gap__rows">
        {gaps.map((g) => (
          <div className="skill-gap__row" key={g.skill}>
            <div className="skill-gap__row-head">
              <span>{g.skill}</span>
              {g.priority && <span className="skill-gap__priority-tag">Priority</span>}
            </div>
            <div className="skill-gap__bars">
              <div className="skill-gap__bar-line">
                <span className="skill-gap__bar-label">Current</span>
                <div className="skill-gap__track">
                  <div className="skill-gap__fill skill-gap__fill--current" style={{ width: `${g.current * 10}%` }} />
                </div>
              </div>
              <div className="skill-gap__bar-line">
                <span className="skill-gap__bar-label">Target</span>
                <div className="skill-gap__track">
                  <div className="skill-gap__fill skill-gap__fill--target" style={{ width: `${g.target * 10}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {priority.length > 0 && (
        <div className="skill-gap__priority">
          <span className="skill-gap__priority-title">
            <Target size={14} /> {priority.length} priority skills
          </span>
          <ol>
            {priority.map((g) => (
              <li key={g.skill}>{g.skill}</li>
            ))}
          </ol>
          <Button onClick={onBuildRoadmap}>Build My Roadmap</Button>
        </div>
      )}
    </div>
  );
}

function SkillLens({ direction, onBuildRoadmap }) {
  const [tab, setTab] = useState("assessment");

  return (
    <div className="skill-lens">
      <div className="skill-lens__tabs" role="tablist" aria-label="Skill views">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`skill-lens__tab ${tab === t.id ? "skill-lens__tab--active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="skill-lens__panel">
        {tab === "assessment" && <SkillAssessmentView assessment={direction.skillAssessment} />}
        {tab === "transferable" && (
          <TransferableSkillsView items={direction.transferableSkills} directionName={direction.name} />
        )}
        {tab === "gap" && <SkillGapView gaps={direction.skillGaps} onBuildRoadmap={onBuildRoadmap} />}
      </div>
    </div>
  );
}

export default SkillLens;
