import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherHeader from '../../components/teacher/TeacherHeader';
import RiskDistributionChart from '../../components/teacher/RiskDistributionChart';
import RiskFilters from '../../components/teacher/RiskFilters';
import StudentRiskList from '../../components/teacher/StudentRiskList';
import StudentDetail from '../../components/teacher/StudentDetail';
import {
  getRiskSummary,
  getStudentsByRisk,
  getStudentDetails,
} from '../../services/teacherService';
import './teacher.css';

const RISK_LABEL = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export default function TeacherAnalytics() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [summaryStatus, setSummaryStatus] = useState('loading');

  const [viewMode, setViewMode] = useState('overview');
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [studentList, setStudentList] = useState([]);
  const [studentListStatus, setStudentListStatus] = useState('idle');

  const [studentDetail, setStudentDetail] = useState(null);
  const [studentDetailStatus, setStudentDetailStatus] = useState('idle');

  // Load real analytics from backend
  useEffect(() => {
    setSummaryStatus('loading');

    getRiskSummary()
      .then((data) => {
        setSummary(data);
        setSummaryStatus('ready');
      })
      .catch((error) => {
        console.error('Failed to load risk summary:', error);
        setSummaryStatus('error');
      });
  }, []);

  // Load students when teacher selects a risk category
  useEffect(() => {
    if (!selectedRisk) return;

    let cancelled = false;

    setStudentListStatus('loading');

    getStudentsByRisk(selectedRisk)
      .then((data) => {
        if (cancelled) return;

        setStudentList(data);
        setStudentListStatus('ready');
      })
      .catch((error) => {
        if (cancelled) return;

        console.error('Failed to load students:', error);
        setStudentListStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [selectedRisk]);

  // Load selected student's details
  useEffect(() => {
    if (!selectedStudentId) return;

    let cancelled = false;

    setStudentDetailStatus('loading');

    getStudentDetails(selectedStudentId)
      .then((data) => {
        if (cancelled) return;

        setStudentDetail(data);
        setStudentDetailStatus('ready');
      })
      .catch((error) => {
        if (cancelled) return;

        console.error('Failed to load student details:', error);
        setStudentDetailStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [selectedStudentId]);

  const handleSelectRisk = useCallback((riskLevel) => {
    setSelectedRisk(riskLevel);
    setViewMode('list');
  }, []);

  const handleSelectStudent = useCallback((studentId) => {
    setSelectedStudentId(studentId);
    setViewMode('detail');
  }, []);

  const handleBack = useCallback(() => {
    if (viewMode === 'detail') {
      setSelectedStudentId(null);
      setStudentDetail(null);
      setViewMode('list');
    } else if (viewMode === 'list') {
      setSelectedRisk(null);
      setStudentList([]);
      setViewMode('overview');
    }
  }, [viewMode]);

  return (
    <div className="teacher-shell">
      <div className="teacher-shell-inner">

        <TeacherHeader
          profile={null}
          onBack={() => navigate('/teacher')}
          backLabel="Teacher Home"
        />

        <div className="analytics-header">

          {viewMode !== 'overview' && (
            <div className="breadcrumb">
              <span>Analytics</span>

              <span className="crumb-sep">/</span>

              {viewMode === 'list' && (
                <span className="crumb-current">
                  {RISK_LABEL[selectedRisk]} Risk
                </span>
              )}

              {viewMode === 'detail' && (
                <>
                  <span>{RISK_LABEL[selectedRisk]} Risk</span>

                  <span className="crumb-sep">/</span>

                  <span className="crumb-current">
                    {studentDetail
                      ? studentDetail.student_name
                      : 'Student'}
                  </span>
                </>
              )}
            </div>
          )}

          <h1 className="analytics-title">
            Academic Risk Analytics
          </h1>

          <p className="analytics-subtitle">
            Review student risk levels and recommended interventions.
          </p>
        </div>

        {/* ================= OVERVIEW ================= */}

        {viewMode === 'overview' && (
          <div className="view-transition">

            {summaryStatus === 'loading' && (
              <div className="panel">
                <div
                  className="skeleton skeleton-line"
                  style={{ width: '50%' }}
                />

                <div className="skeleton skeleton-block" />
              </div>
            )}

            {summaryStatus === 'error' && (
              <div className="panel">
                <div className="state-card error">
                  <div className="state-title">
                    Unable to load analytics.
                  </div>

                  <div className="state-body">
                    Please make sure the backend is running.
                  </div>
                </div>
              </div>
            )}

            {summaryStatus === 'ready' && (
              <>
                <div className="analytics-grid">
                  <RiskDistributionChart
                    summary={summary}
                  />
                </div>

                <div className="risk-section">
                  <RiskFilters
                    summary={summary}
                    selectedRisk={selectedRisk}
                    onSelect={handleSelectRisk}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= STUDENT LIST ================= */}

        {viewMode === 'list' && (
          <div className="risk-section view-transition">

            <button
              type="button"
              className="detail-back"
              onClick={handleBack}
            >
              ← Back to Analytics
            </button>

            <RiskFilters
              summary={summary}
              selectedRisk={selectedRisk}
              onSelect={handleSelectRisk}
            />

            <StudentRiskList
              riskLevel={selectedRisk}
              status={studentListStatus}
              students={studentList}
              onSelectStudent={handleSelectStudent}
            />

          </div>
        )}

        {/* ================= STUDENT DETAIL ================= */}

        {viewMode === 'detail' && (
          <div className="risk-section view-transition">

            <StudentDetail
              status={studentDetailStatus}
              student={studentDetail}
              riskLevel={RISK_LABEL[selectedRisk]}
              onBack={handleBack}
            />

          </div>
        )}

      </div>
    </div>
  );
}