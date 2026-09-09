import { useState } from "react";
import {
  Lightbulb,
  Sparkles,
  ScanSearch,
  Compass,
  Wrench,
  Repeat,
  Target,
  Map,
} from "lucide-react";

const ICONS = {
  interest: Lightbulb,
  discovery: Sparkles,
  analysis: ScanSearch,
  direction: Compass,
  skills: Wrench,
  transferable: Repeat,
  gap: Target,
  roadmap: Map,
};

/**
 * NavigationJourney — an interactive horizontal pathway.
 * Hovering OR clicking a node reveals its description beneath the row;
 * clicking "pins" the description so it stays visible without needing
 * continuous hover (important for touch devices).
 */
function NavigationJourney({ stages }) {
  const [activeId, setActiveId] = useState(stages[0].id);
  const active = stages.find((s) => s.id === activeId) ?? stages[0];

  return (
    <div className="nav-journey">
      <div className="nav-journey__track" role="list">
        {stages.map((stage, i) => {
          const Icon = ICONS[stage.id] ?? Lightbulb;
          const isActive = stage.id === activeId;
          return (
            <div className="nav-journey__item" role="listitem" key={stage.id}>
              <button
                type="button"
                className={`nav-journey__node ${isActive ? "nav-journey__node--active" : ""}`}
                onMouseEnter={() => setActiveId(stage.id)}
                onFocus={() => setActiveId(stage.id)}
                onClick={() => setActiveId(stage.id)}
                aria-pressed={isActive}
              >
                <Icon size={17} />
              </button>
              <span className={`nav-journey__label ${isActive ? "nav-journey__label--active" : ""}`}>
                {stage.title}
              </span>
              {i < stages.length - 1 && <span className="nav-journey__connector" aria-hidden="true" />}
            </div>
          );
        })}
      </div>

      <div className="nav-journey__detail" aria-live="polite">
        <span className="nav-journey__detail-title">{active.title}</span>
        <p className="nav-journey__detail-text">{active.description}</p>
      </div>
    </div>
  );
}

export default NavigationJourney;
