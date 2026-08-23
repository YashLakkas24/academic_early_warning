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
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function StudentDetail({
  status,
  student,
  riskLevel,
  onBack,
}) {
  // =========================================================
  // LOADING
  // =========================================================

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

  // =========================================================
  // ERROR
  // =========================================================

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

  // =========================================================
  // DATA
  // =========================================================

  const intervention = student.intervention || {};

  const interventionReasons = Array.isArray(
    intervention.reasons
  )
    ? intervention.reasons
    : [];

  /*
   * Backend currently returns the AI suggestion as:
   *
   * ai_analysis: "Implement a structured study plan..."
   *
   * teacherService.js should normalize this to ai_suggestion.
   *
   * We support BOTH here so the UI does not break.
   */

  const aiSuggestion =
    student.ai_suggestion ||
    student.ai_analysis ||
    'AI suggestion is currently unavailable.';

  const performanceTrend =
    student.performance_trend || 'STABLE';

  const trendIcon =
    TREND_ICON[performanceTrend] || TREND_ICON.STABLE;

  const formattedTrend =
    performanceTrend.charAt(0) +
    performanceTrend.slice(1).toLowerCase();

  // =========================================================
  // STUDENT DETAIL
  // =========================================================

  return (
    <div>

      {/* =====================================================
          BACK BUTTON
          ===================================================== */}

      <button
        type="button"
        className="detail-back"
        onClick={onBack}
      >
        ← Back to {riskLevel} Risk Students
      </button>


      {/* =====================================================
          STUDENT IDENTITY
          ===================================================== */}

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


      {/* =====================================================
          RISK INFORMATION
          ===================================================== */}

      <div className="detail-stats">

        {/* Risk Level */}

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


        {/* Performance Trend */}

        <div className="stat-card">

          <div className="stat-label">
            Performance Trend
          </div>

          <div className="stat-value">

            <span>
              {trendIcon}
            </span>

            {formattedTrend}

          </div>

        </div>

      </div>


      {/* =====================================================
          AI INTERVENTION
          ===================================================== */}

      <div className="detail-section">

        <div className="detail-section-label">
          AI Intervention
        </div>

        <div className="detail-section-body">

          {interventionReasons.length > 0 ? (

            <ul>
              {interventionReasons.map(
                (reason, index) => (
                  <li key={index}>
                    {reason}
                  </li>
                )
              )}
            </ul>

          ) : (

            <p>
              AI intervention information is
              currently unavailable.
            </p>

          )}

        </div>

      </div>


      {/* =====================================================
          AI SUGGESTION
          ===================================================== */}

      <div className="detail-section">

        <div className="detail-section-label">
          AI Suggestion
        </div>

        <div className="detail-section-body suggestion">

          {aiSuggestion}

        </div>

      </div>

    </div>
  );
}