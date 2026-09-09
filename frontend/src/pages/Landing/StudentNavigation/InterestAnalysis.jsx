import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Button from "../../../components/Button/Button";
import Modal from "../../../components/Modal/Modal";
import { scoreToBars } from "../../../utils/scoreLabel";

const DIMENSIONS = [
  { key: "interestStrength", label: "Interest Strength" },
  { key: "confidence", label: "Confidence" },
  { key: "experience", label: "Experience" },
  { key: "capability", label: "Capability" },
];

function Bar({ filled, total = 10 }) {
  return (
    <div className="interest-bar" role="img" aria-label={`${filled} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={i < filled ? "interest-bar__seg interest-bar__seg--filled" : "interest-bar__seg"} />
      ))}
    </div>
  );
}

function InterestAnalysis({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="interest-analysis">
      <div className="interest-analysis__head">
        <span className="eyebrow eyebrow--nav">Interest Analysis</span>
        <h3 className="interest-analysis__title">{data.interest}</h3>
      </div>

      <div className="interest-analysis__bars">
        {DIMENSIONS.map((dim) => (
          <div className="interest-analysis__row" key={dim.key}>
            <span className="interest-analysis__row-label">{dim.label}</span>
            <Bar filled={scoreToBars(data[dim.key])} />
          </div>
        ))}
      </div>

      <p className="interest-analysis__note">
        These reflect the AI's interpretation of the student's responses — not academic marks or a
        precise measurement.
      </p>

      <div className="interest-analysis__why">
        <span className="interest-analysis__why-label">Why this matters</span>
        <p>{data.whyThisMatters}</p>
      </div>

      <Button variant="secondary" icon={<ChevronRight size={16} />} onClick={() => setOpen(true)}>
        View Analysis
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        eyebrow="Interest Analysis · Illustrative data"
        title={`${data.interest} — full breakdown`}
      >
        <div className="analysis-modal">
          <section>
            <h4>Evidence</h4>
            <ul>
              {data.evidence.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
          <section>
            <h4>Strengths</h4>
            <ul>
              {data.strengths.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
          <section>
            <h4>Development areas</h4>
            <ul>
              {data.developmentAreas.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
          <section>
            <h4>Next step</h4>
            <p>Explore potential directions informed by this analysis below.</p>
          </section>
        </div>
      </Modal>
    </div>
  );
}

export default InterestAnalysis;
