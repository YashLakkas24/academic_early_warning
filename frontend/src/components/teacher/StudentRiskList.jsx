const LEVEL_LABEL = { HIGH: 'High Risk', MEDIUM: 'Medium Risk', LOW: 'Low Risk' };

function initialsOf(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function StudentRiskList({ riskLevel, status, students, onSelectStudent }) {
  if (status === 'loading') {
    return (
      <div className="student-list" style={{ padding: 20 }}>
        <div className="skeleton skeleton-line" style={{ width: '40%' }} />
        <div className="skeleton skeleton-line" style={{ width: '90%' }} />
        <div className="skeleton skeleton-line" style={{ width: '90%' }} />
        <div className="skeleton skeleton-line" style={{ width: '90%' }} />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="state-card error">
        <div className="state-title">Unable to load students.</div>
        <div className="state-body">Please try again.</div>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="state-card">
        <div className="state-title">No {LEVEL_LABEL[riskLevel].toLowerCase()} students found.</div>
        <div className="state-body">
          Great — no students currently require {riskLevel === 'HIGH' ? 'high-priority' : 'this level of'} intervention.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="student-list-heading" style={{ marginTop: 20 }}>
        {LEVEL_LABEL[riskLevel]} Students
      </div>
      <div className="student-list">
        {students.map((student) => (
          <div
            key={student.student_id}
            className="student-row"
            role="button"
            tabIndex={0}
            onClick={() => onSelectStudent(student.student_id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelectStudent(student.student_id);
            }}
          >
            <div className="student-row-main">
              <div className="student-avatar">{initialsOf(student.student_name)}</div>
              <div>
                <div className="student-row-name">{student.student_name}</div>
                <div className="student-row-id">{student.student_id}</div>
              </div>
            </div>
            <div className="student-row-side">
              <span className="risk-pill" data-level={riskLevel}>
                {riskLevel}
              </span>
              <span className="row-chevron">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
