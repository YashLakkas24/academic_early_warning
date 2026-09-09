import { Activity } from 'lucide-react';
function initialsOf(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

/**
 * Top bar shown on both Teacher pages: brand mark on the left,
 * teacher's profile chip on the right. Optionally renders a back
 * link (used on the Analytics page to return to Welcome).
 */
export default function TeacherHeader({ profile, onBack, backLabel }) {
  return (
    <div className="teacher-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div className="teacher-brand">
          <span className="navbar__mark" aria-hidden="true">
            <Activity size={18} strokeWidth={2.4} />
          </span>
          E.A.R.N
        </div>
        {onBack && (
          <button type="button" className="teacher-back-link" onClick={onBack}>
            ← {backLabel || 'Back'}
          </button>
        )}
      </div>

      {profile && (
        <div className="teacher-profile-chip">
          <div className="teacher-profile-avatar">{initialsOf(profile.teacher_name)}</div>
          <div className="teacher-profile-text">
            <strong>{profile.teacher_name}</strong>
            <span>{profile.teacher_id}</span>
          </div>
        </div>
      )}
    </div>
  );
}
