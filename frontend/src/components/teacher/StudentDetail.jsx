const TREND_ICON = {
  IMPROVING: '📈',
  STABLE: '➖',
  DECLINING: '📉',
};

function initialsOf(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function StudentDetail({
  status,
  student,
  riskLevel,
  onBack,
}) {
  if (status === 'loading') {
    return (
      <div>
        <div
          className="skeleton skeleton-line"
          style={{ width: '30%' }}
        />

        <div
          className="skeleton skeleton-block"
          style={{
            height: 180,
            marginTop: 16,
          }}
        />
      </div>
    );
  }

  if (status === 'error' || !student) {
    return (
      <div className="state-card error">
        <div className="state-title">
          Unable to load this student's profile.
        </div>

        <div className="state-body">
          Please try again.
        </div>
      </div>
    );
  }

  const intervention =
    student.intervention?.reasons || [];

  const aiSuggestion =
    student.ai_suggestion || '';

  return (
    <div>

      {/* Back button */}

      <button
        type="button"
        className="detail-back"
        onClick={onBack}
      >
        ← Back to {riskLevel} Risk Students
      </button>


      {/* Student identity */}

      <div className="detail-heading">

        <div className="detail-avatar">
          {initialsOf(student.student_name)}
        </div>

        <div>

          <h3>
            {student.student_name}
          </h3>

          <span>
            Student ID: {student.student_id}
          </span>

        </div>

      </div>


      {/* Risk information */}

      <div className="detail-stats">

        <div className="stat-card">

          <div className="stat-label">
            Risk Level
          </div>

          <div className="stat-value">

            <span
              className="risk-pill"
              data-level={student.risk_level}
            >
              {student.risk_level}
            </span>

          </div>

        </div>


        {student.performance_trend && (

          <div className="stat-card">

            <div className="stat-label">
              Performance Trend
            </div>

            <div className="stat-value">

              <span>
                {TREND_ICON[
                  student.performance_trend
                ] || '➖'}
              </span>

              {student.performance_trend
                .charAt(0)
                .toUpperCase() +
                student.performance_trend
                  .slice(1)
                  .toLowerCase()}

            </div>

          </div>

        )}

      </div>


      {/* =================================================
          AI INTERVENTION
          ================================================= */}

      <div className="detail-section">

        <div className="detail-section-label">
          AI Intervention
        </div>

        <div className="detail-section-body">

          {intervention.length > 0 ? (

            <ul>

              {intervention
                .slice(0, 2)
                .map((line, index) => (

                  <li key={index}>
                    {line}
                  </li>

                ))}

            </ul>

          ) : (

            <p>
              AI intervention is currently
              unavailable.
            </p>

          )}

        </div>

      </div>


      {/* =================================================
          AI SUGGESTION
          ================================================= */}

      <div className="detail-section">

        <div className="detail-section-label">
          AI Suggestion
        </div>

        <div className="detail-section-body suggestion">

          {aiSuggestion ||
            'AI suggestion is currently unavailable.'}

        </div>

      </div>

    </div>
  );
}