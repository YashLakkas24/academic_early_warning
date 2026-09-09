import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStudentProfile,
  getStudentInterestAnalysis,
} from "../../services/studentService";

import {
  LayoutDashboard,
  User,
  Sparkles,
  Puzzle,
  Compass,
  LogOut,
  GraduationCap,
  CalendarCheck,
  Award,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [studentData, setStudentData] = useState(null);
  const [interestAnalysis, setInterestAnalysis] = useState(null);

  const savedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const studentId = savedUser.student_id || savedUser.user_id || "STU001";

  useEffect(() => {
    let isMounted = true;

    getStudentProfile(studentId)
      .then((data) => {
        if (isMounted) {
          setStudentData(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setStudentData(null);
        }
      });

    getStudentInterestAnalysis(studentId)
      .then((data) => {
        if (isMounted && data.has_analysis && data.analyses?.length) {
          setInterestAnalysis(data.analyses[0]);
        }
      })
      .catch(() => {
        if (isMounted) {
          setInterestAnalysis(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [studentId]);

  const student = {
    name: studentData?.name || savedUser.full_name || "Aarav Sharma",
    studentId: studentData?.student_id || studentId,
    rollNumber: studentData?.roll_number || "01",
    branch: "AIDS",
    year: "3rd Year",
    attendance: studentData?.attendance ?? 92,
    previousCgpa: studentData?.previous_sem_cgpa ?? 8.4,
    extracurricular: studentData?.extracurricular_count ?? 3,
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "profile",
      label: "My Profile",
      icon: User,
    },
    {
      id: "interest",
      label: "Interest+",
      icon: Sparkles,
      highlight: true,
    },
    {
      id: "skills",
      label: "Skill Gaps",
      icon: Puzzle,
    },
    {
      id: "roadmap",
      label: "AI Roadmap",
      icon: Compass,
    },
  ];

  return (
    <div className="student-dashboard">
      {/* Sidebar */}
      <aside className="student-sidebar">
        <div className="student-brand">
          <div className="student-brand-icon">
            <GraduationCap size={22} />
          </div>

          <div>
            <h2>Student</h2>
            <span>Workspace</span>
          </div>
        </div>

        <nav className="student-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`student-nav-item ${
                  activePage === item.id ? "active" : ""
                } ${item.highlight ? "interest-nav" : ""}`}
                onClick={() => {
                  if (item.id === "interest") {
                    navigate("/student/interest");
                    return;
                  }

                  if (item.id === "skills") {
                    navigate("/student/skills");
                    return;
                  }

                  if (item.id === "roadmap") {
                    navigate("/student/roadmap");
                    return;
                  }

                  setActivePage(item.id);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>

                {item.highlight && <span className="interest-badge">AI</span>}
              </button>
            );
          })}
        </nav>

        <div className="student-sidebar-bottom">
          <button
            className="student-nav-item logout-item"
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="student-main">
        {/* Header */}
        <header className="student-header">
          <div>
            <span className="student-eyebrow">STUDENT WORKSPACE</span>

            <h1>Welcome back, {student.name.split(" ")[0]} 👋</h1>

            <p>Here's an overview of your academic journey.</p>
          </div>

          <div className="student-profile-mini">
            <div className="student-avatar">{student.name.charAt(0)}</div>

            <div>
              <strong>{student.name}</strong>
              <span>{student.studentId}</span>
            </div>
          </div>
        </header>

        {/* Student Identity */}
        <section className="student-identity-card">
          <div className="identity-icon">
            <GraduationCap size={25} />
          </div>

          <div className="identity-info">
            <h2>{student.name}</h2>

            <p>
              {student.studentId} · Roll {student.rollNumber} · {student.branch}{" "}
              · {student.year}
            </p>
          </div>

          <button
            className="identity-profile-button"
            onClick={() => setActivePage("profile")}
          >
            View Profile
            <ChevronRight size={16} />
          </button>
        </section>

        {/* Academic Snapshot */}
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <span className="section-label">OVERVIEW</span>
              <h2>Academic Snapshot</h2>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <CalendarCheck size={21} />
              </div>

              <div>
                <span>Attendance</span>
                <strong>{student.attendance}%</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <GraduationCap size={21} />
              </div>

              <div>
                <span>Previous Sem CGPA</span>
                <strong>{student.previousCgpa}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Award size={21} />
              </div>

              <div>
                <span>Extracurricular</span>
                <strong>{student.extracurricular}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Interest+ */}
        <section className="interest-card">
          <div className="interest-card-content">
            <div className="interest-icon">
              <Sparkles size={25} />
            </div>

            <div>
              <span className="section-label">
                {interestAnalysis ? "AI PROFILE READY" : "AI-POWERED DISCOVERY"}
              </span>

              <h2>
                {interestAnalysis
                  ? `Interest Profile: ${interestAnalysis.interest}`
                  : "Interest+"}
              </h2>

              <p>
                {interestAnalysis?.summary ||
                  "Discover what genuinely interests you through adaptive questions. Your responses help us understand your interests, experience and areas worth exploring."}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "12px",
                }}
              >
                {interestAnalysis ? (
                  <>
                    <button
                      className="primary-action"
                      onClick={() => navigate("/student/interest/result")}
                    >
                      View Full Analysis
                      <ChevronRight size={17} />
                    </button>

                    <button
                      className="primary-action"
                      style={{
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                      onClick={() => navigate("/student/interest")}
                    >
                      Explore New Interest
                      <ChevronRight size={17} />
                    </button>
                  </>
                ) : (
                  <button
                    className="primary-action"
                    onClick={() => navigate("/student/interest")}
                  >
                    Start Interest Discovery
                    <ChevronRight size={17} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="interest-card-decoration">
            <Sparkles size={100} strokeWidth={0.7} />
          </div>
        </section>

        {/* Lower cards */}
        <section className="dashboard-grid">
          {/* Skill Gaps */}
          <div className="feature-card">
            <div className="feature-card-top">
              <div className="feature-icon">
                <Puzzle size={21} />
              </div>

              <span
                className="coming-soon"
                style={{
                  background: "rgba(59, 130, 246, 0.2)",
                  color: "#93c5fd",
                }}
              >
                AI INSIGHTS
              </span>
            </div>

            <h3>Skill Gaps</h3>

            <p>
              Understand the skills you need to strengthen based on your
              interests and current capabilities.
            </p>

            <button onClick={() => navigate("/student/skills")}>
              Explore
              <ChevronRight size={16} />
            </button>
          </div>

          {/* AI Roadmap */}
          <div className="feature-card">
            <div className="feature-card-top">
              <div className="feature-icon">
                <Compass size={21} />
              </div>

              <span
                className="coming-soon"
                style={{
                  background: "rgba(168, 85, 247, 0.2)",
                  color: "#d8b4fe",
                }}
              >
                PERSONALIZED
              </span>
            </div>

            <h3>AI Roadmap</h3>

            <p>
              Step-by-step personalized learning milestones generated by AI to
              bridge your identified skill gaps.
            </p>

            <button onClick={() => navigate("/student/roadmap")}>
              View Roadmap
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {/* Temporary notice */}
        {activePage !== "dashboard" && (
          <div className="dashboard-notice">
            <strong>
              {menuItems.find((item) => item.id === activePage)?.label}
            </strong>

            <span>
              This section will be connected to its full functionality in the
              next step.
            </span>

            <button onClick={() => setActivePage("dashboard")}>
              Back to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;
