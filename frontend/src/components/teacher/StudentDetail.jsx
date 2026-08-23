const TREND_ICON = { IMPROVING: '📈', STABLE: '➖', DECLINING: '📉' };

function initialsOf(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function StudentDetail({ status, student, riskLevel, onBack }) {
  if (status === 'loading') {
    return (
      <div>
        <div className="skeleton skeleton-line" style={{ width: '30%' }} />
        <div className="skeleton skeleton-block" style={{ height: 180, marginTop: 16 }} />
      </div>
    );
  }

  if (status === 'error' || !student) {
    return (
      <div className="state-card error">
        <div className="state-title">Unable to load this student's profile.</div>
        <div className="state-body">Please try again.</div>
      </div>
    );
  }

  return (
    <div>
      <button type="button" className="detail-back" onClick={onBack}>
        ← Back to {riskLevel} Risk Students
      </button>

      <div className="detail-heading">
        <div className="detail-avatar">{initialsOf(student.student_name)}</div>
        <div>
          <h3>{student.student_name}</h3>
          <span>Student ID: {student.student_id}</span>
        </div>
      </div>

      <div className="detail-stats">
        <div className="stat-card">
          <div className="stat-label">Risk Level</div>
          <div className="stat-value">
            <span className="risk-pill" data-level={student.risk_level}>
              {student.risk_level}
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Risk Score</div>
          <div className="stat-value">{student.risk_score}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Performance</div>
          <div className="stat-value">
            <span>{TREND_ICON[student.performance_trend]}</span>
            {student.performance_trend.charAt(0) + student.performance_trend.slice(1).toLowerCase()}
          </div>
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-section-label">Intervention</div>
        <div className="detail-section-body">{student.intervention}</div>
      </div>

      <div className="detail-section">
        <div className="detail-section-label">AI Suggestion</div>
        <div className="detail-section-body suggestion">{student.ai_suggestion}</div>
      </div>
    </div>
  );
}
