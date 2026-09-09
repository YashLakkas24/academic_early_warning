import { Check, Compass } from "lucide-react";

function DirectionsGrid({ directions, selectedId, onSelect }) {
  return (
    <div className="directions-grid">
      <div className="directions-grid__head">
        <span className="eyebrow eyebrow--nav">
          <Compass size={12} />
          Potential Directions
        </span>
        <span className="directions-grid__demo-tag">Illustrative alignment scores</span>
      </div>

      <div className="directions-grid__list">
        {directions.map((dir) => {
          const isSelected = dir.id === selectedId;
          return (
            <button
              type="button"
              key={dir.id}
              className={`direction-card ${isSelected ? "direction-card--selected" : ""}`}
              onClick={() => onSelect(dir.id)}
              aria-pressed={isSelected}
            >
              <div className="direction-card__top">
                <span className="direction-card__alignment">{dir.alignment}% alignment</span>
                {isSelected && (
                  <span className="direction-card__badge">
                    <Check size={12} /> Selected
                  </span>
                )}
              </div>
              <h4 className="direction-card__name">{dir.name}</h4>

              <div className="direction-card__section">
                <span className="direction-card__section-label">Why it fits</span>
                <ul>
                  {dir.whyItFits.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="direction-card__meta">
                <span>Readiness: {dir.readiness}%</span>
                <span>Top gap: {dir.topSkillGap}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DirectionsGrid;
