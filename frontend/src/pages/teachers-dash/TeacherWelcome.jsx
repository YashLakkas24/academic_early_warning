import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TeacherHeader from '../../components/teacher/TeacherHeader';
import { getTeacherProfile } from '../../services/teacherService';
import { logout } from '../../services/authService';

import './teacher.css';

export default function TeacherWelcome() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('loading');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setStatus('loading');

    getTeacherProfile()
      .then((data) => {
        if (cancelled) return;

        setProfile(data);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;

        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await logout();

      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);

      navigate('/', { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="teacher-shell">
      <div className="teacher-shell-inner">

        <TeacherHeader
          profile={status === 'ready' ? profile : null}
        />

        {/* Logout Button */}
        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? 'Logging out...' : 'Logout'}
        </button>

        <div className="welcome-hero view-transition">

          <span className="welcome-eyebrow">
            Academic Early Warning
          </span>

          <h1 className="welcome-heading">
            Turn Academic Signals Into Action
          </h1>

          <p className="welcome-subheading">
            Review class-wide risk patterns, understand why students need
            support, and act early — before a decline becomes a crisis.
          </p>

          {status === 'loading' && (
            <div style={{ marginBottom: 32 }}>
              <div
                className="skeleton skeleton-line"
                style={{
                  width: 260,
                  height: 16
                }}
              />

              <div
                className="skeleton"
                style={{
                  width: '100%',
                  height: 88,
                  borderRadius: 16,
                  marginTop: 14
                }}
              />
            </div>
          )}

          {status === 'error' && (
            <div
              className="state-card error"
              style={{
                marginBottom: 28,
                textAlign: 'left'
              }}
            >
              <div className="state-title">
                Unable to load your profile.
              </div>

              <div className="state-body">
                Please try again.
              </div>
            </div>
          )}

          {status === 'ready' && profile && (
            <>
              <div className="welcome-greeting">
                Welcome, <b>Professor {profile.teacher_name}</b>
              </div>

              <div className="profile-card">

                <div className="profile-card-field">
                  <div className="profile-card-label">
                    Teacher Name
                  </div>

                  <div className="profile-card-value">
                    {profile.teacher_name}
                  </div>
                </div>

                <div className="profile-card-field">
                  <div className="profile-card-label">
                    Teacher ID
                  </div>

                  <div className="profile-card-value">
                    {profile.teacher_id}
                  </div>
                </div>

                <div className="profile-card-field">
                  <div className="profile-card-label">
                    Department
                  </div>

                  <div className="profile-card-value">
                    {profile.department}
                  </div>
                </div>

              </div>
            </>
          )}

          <button
            type="button"
            className="cta-btn"
            onClick={() => navigate('/teacher/analytics')}
          >
            Show Analytics
            <span className="arrow">→</span>
          </button>

        </div>
      </div>
    </div>
  );
}