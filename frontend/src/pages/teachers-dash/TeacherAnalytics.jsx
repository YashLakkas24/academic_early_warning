import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherHeader from '../../components/teacher/TeacherHeader';
import RiskDistributionChart from '../../components/teacher/RiskDistributionChart';
import PerformanceTrendChart from '../../components/teacher/PerformanceTrendChart';
import RiskFilters from '../../components/teacher/RiskFilters';
import StudentRiskList from '../../components/teacher/StudentRiskList';
import StudentDetail from '../../components/teacher/StudentDetail';
import {
  getTeacherProfile,
  getRiskSummary,
  getPerformanceTrend,
  getStudentsByRisk,
  getStudentDetails,
} from '../../services/teacherService';
import './teacher.css';

const RISK_LABEL = { HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low' };

export default function TeacherAnalytics() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [summary, setSummary] = useState(null);
  const [summaryStatus, setSummaryStatus] = useState('loading');

  const [trend, setTrend] = useState([]);
  const [trendStatus, setTrendStatus] = useState('loading');

  // viewMode drives the internal navigation within this single page:
  // 'overview' -> 'list' -> 'detail'
  const [viewMode, setViewMode] = useState('overview');
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [studentList, setStudentList] = useState([]);
  const [studentListStatus, setStudentListStatus] = useState('idle');

  const [studentDetail, setStudentDetail] = useState(null);
  const [studentDetailStatus, setStudentDetailStatus] = useState('idle');

  // ---- Initial page data ----
  useEffect(() => {
    getTeacherProfile().then(setProfile).catch(() => {});

    setSummaryStatus('loading');
    getRiskSummary()
      .then((data) => {
        setSummary(data);
        setSummaryStatus('ready');
      })
      .catch(() => setSummaryStatus('error'));

    setTrendStatus('loading');
    getPerformanceTrend()
      .then((data) => {
        setTrend(data);
        setTrendStatus('ready');
      })
      .catch(() => setTrendStatus('error'));
  }, []);

  // ---- Fetch students whenever a risk level is selected ----
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
      .catch(() => {
        if (cancelled) return;
        setStudentListStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [selectedRisk]);

  // ---- Fetch student detail whenever a student is selected ----
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
      .catch(() => {
        if (cancelled) return;
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

  // Back navigates exactly one level: detail -> list -> overview.
  const handleBack = useCallback(() => {
    if (viewMode === 'detail') {
      setSelectedStudentId(null);
      setStudentDetail(null);
      setViewMode('list');
    } else if (viewMode === 'list') {
      setSelectedRisk(null);
      setViewMode('overview');
    }
  }, [viewMode]);

  return (
    <div className="teacher-shell">
      <div className="teacher-shell-inner">
        <TeacherHeader profile={profile} onBack={() => navigate('/teacher')} backLabel="Teacher Home" />

        <div className="analytics-header">
          {viewMode !== 'overview' && (
            <div className="breadcrumb">
              <span>Analytics</span>
              <span className="crumb-sep">/</span>
              {viewMode === 'list' && (
                <span className="crumb-current">{RISK_LABEL[selectedRisk]} Risk</span>
              )}
              {viewMode === 'detail' && (
                <>
                  <span>{RISK_LABEL[selectedRisk]} Risk</span>
                  <span className="crumb-sep">/</span>
                  <span className="crumb-current">
                    {studentDetail ? studentDetail.student_name : '…'}
                  </span>
                </>
              )}
            </div>
          )}
          <h1 className="analytics-title">Academic Risk Analytics</h1>
          <p className="analytics-subtitle">
            Monitor student risk patterns, performance trends and intervention priorities.
          </p>
        </div>

        {viewMode === 'overview' && (
          <div className="view-transition">
            <div className="analytics-grid">
              {summaryStatus === 'loading' && (
                <div className="panel">
                  <div className="skeleton skeleton-line" style={{ width: '50%' }} />
                  <div className="skeleton skeleton-block" />
                </div>
              )}
              {summaryStatus === 'error' && (
                <div className="panel">
                  <div className="state-card error">
                    <div className="state-title">Unable to load analytics.</div>
                    <div className="state-body">Please try again.</div>
                  </div>
                </div>
              )}
              {summaryStatus === 'ready' && <RiskDistributionChart summary={summary} />}

              {trendStatus === 'loading' && (
                <div className="panel">
                  <div className="skeleton skeleton-line" style={{ width: '50%' }} />
                  <div className="skeleton skeleton-block" />
                </div>
              )}
              {trendStatus === 'error' && (
                <div className="panel">
                  <div className="state-card error">
                    <div className="state-title">Unable to load analytics.</div>
                    <div className="state-body">Please try again.</div>
                  </div>
                </div>
              )}
              {trendStatus === 'ready' && <PerformanceTrendChart students={trend} />}
            </div>

            <div className="risk-section">
              <RiskFilters summary={summary} selectedRisk={selectedRisk} onSelect={handleSelectRisk} />
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          <div className="risk-section view-transition">
            <button type="button" className="detail-back" onClick={handleBack}>
              ← Back to Analytics
            </button>
            <RiskFilters summary={summary} selectedRisk={selectedRisk} onSelect={handleSelectRisk} />
            <StudentRiskList
              riskLevel={selectedRisk}
              status={studentListStatus}
              students={studentList}
              onSelectStudent={handleSelectStudent}
            />
          </div>
        )}

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
