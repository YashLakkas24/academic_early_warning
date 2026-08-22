const LEVELS = [
  { key: 'HIGH', label: 'High Risk', hex: '#EA5B5B' },
  { key: 'MEDIUM', label: 'Medium Risk', hex: '#EDA83F' },
  { key: 'LOW', label: 'Low Risk', hex: '#33C29B' },
];

export default function RiskFilters({ summary, selectedRisk, onSelect }) {
  const countFor = (key) => (summary ? summary[key.toLowerCase()] : null);

  return (
    <div>
      <h3 className="panel-title">Risk</h3>
      <p className="panel-subtitle">Select a risk level to view students requiring attention.</p>

      <div className="risk-filters">
        {LEVELS.map((level) => (
          <button
            key={level.key}
            type="button"
            data-level={level.key}
            className={`risk-filter-btn${selectedRisk === level.key ? ' active' : ''}`}
            onClick={() => onSelect(level.key)}
            aria-pressed={selectedRisk === level.key}
          >
            <span className="swatch" style={{ background: level.hex }} />
            {level.label.toUpperCase()}
            {countFor(level.key) !== null && (
              <span className="risk-filter-count">{countFor(level.key)}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
