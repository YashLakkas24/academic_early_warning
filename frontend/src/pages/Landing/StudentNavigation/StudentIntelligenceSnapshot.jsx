import { Sparkles } from "lucide-react";
import { scoreToLabel } from "../../../utils/scoreLabel";

/**
 * StudentIntelligenceSnapshot — a compact card summarizing what the system
 * currently understands about one student, plus a small network visual
 * showing that several signals (interest, experience, confidence) feed
 * into one profile. Demo data only, clearly labeled.
 */
function StudentIntelligenceSnapshot({ student, interestAnalysis, directionCount }) {
  return (
    <div className="snapshot-card">
      <div className="snapshot-card__head">
        <span className="eyebrow eyebrow--nav">
          <Sparkles size={12} />
          Student Intelligence
        </span>
        <span className="snapshot-card__demo-tag">Illustrative data</span>
      </div>

      <div className="snapshot-card__body">
        <div className="snapshot-card__profile">
          <div className="snapshot-card__avatar" aria-hidden="true">
            {student.name.charAt(0)}
          </div>
          <div>
            <span className="snapshot-card__name">{student.name}</span>
            <span className="snapshot-card__meta">Current interest: {student.currentInterest}</span>
          </div>
        </div>

        <div className="snapshot-network" role="img" aria-label="Diagram connecting interest, experience and confidence signals to the student's profile">
          <svg viewBox="0 0 260 130" className="snapshot-network__svg">
            <g className="snapshot-network__edges">
              <line x1="130" y1="65" x2="40" y2="24" />
              <line x1="130" y1="65" x2="40" y2="106" />
              <line x1="130" y1="65" x2="220" y2="24" />
              <line x1="130" y1="65" x2="220" y2="106" />
            </g>
            <circle cx="130" cy="65" r="16" className="snapshot-network__center" />
            <circle cx="40" cy="24" r="8" className="snapshot-network__node" />
            <circle cx="40" cy="106" r="8" className="snapshot-network__node" />
            <circle cx="220" cy="24" r="8" className="snapshot-network__node" />
            <circle cx="220" cy="106" r="8" className="snapshot-network__node" />
          </svg>
          <div className="snapshot-network__labels">
            <span style={{ left: "6%", top: "6%" }}>Interest</span>
            <span style={{ left: "6%", top: "78%" }}>Experience</span>
            <span style={{ right: "4%", top: "6%" }} className="snapshot-network__label-right">Confidence</span>
            <span style={{ right: "4%", top: "78%" }} className="snapshot-network__label-right">Skills</span>
          </div>
        </div>

        <dl className="snapshot-card__stats">
          <div>
            <dt>Interest strength</dt>
            <dd>{scoreToLabel(interestAnalysis.interestStrength)}</dd>
          </div>
          <div>
            <dt>Confidence</dt>
            <dd>{scoreToLabel(interestAnalysis.confidence)}</dd>
          </div>
          <div>
            <dt>Experience</dt>
            <dd>MUN / Debate</dd>
          </div>
          <div>
            <dt>Potential directions</dt>
            <dd>{directionCount} identified</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default StudentIntelligenceSnapshot;
