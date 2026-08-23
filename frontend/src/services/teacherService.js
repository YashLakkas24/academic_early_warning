const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Request to ${path} failed with status ${response.status}`
    );
  }

  return response.json();
}

let analyticsCache = null;

export async function getTeacherAnalytics() {
  if (!analyticsCache) {
    analyticsCache = await apiGet("/teacher/analytics");
  }

  return analyticsCache;
}

// Teacher Welcome page
// Temporary static profile because we haven't created
// teacher profile storage in the backend yet.
export async function getTeacherProfile() {
  return {
    teacher_name: "Teacher",
    teacher_id: "TCH-001",
    department: "AI & Data Science",
  };
}

// Risk chart
export async function getRiskSummary() {
  const data = await getTeacherAnalytics();

  return {
    high: data.risk_summary.HIGH,
    medium: data.risk_summary.MEDIUM,
    low: data.risk_summary.LOW,
  };
}

// Performance trend
export async function getPerformanceTrend() {
  const data = await getTeacherAnalytics();

  const allStudents = [
    ...(data.students.HIGH || []),
    ...(data.students.MEDIUM || []),
    ...(data.students.LOW || []),
  ];

  return allStudents.map((student) => ({
    student_id: student.student_id,
    student_name: student.student_name,
    trend_score: 0,
    trend: "STABLE",
  }));
}

// Students in selected risk category
export async function getStudentsByRisk(riskLevel) {
  const data = await getTeacherAnalytics();

  return (data.students[riskLevel] || []).map((student) => ({
    student_id: student.student_id,
    student_name: student.student_name,
    risk_level: student.risk_level,
  }));
}

// Individual student
export async function getStudentDetails(studentId) {
  const data = await getTeacherAnalytics();

  const allStudents = [
    ...(data.students.HIGH || []),
    ...(data.students.MEDIUM || []),
    ...(data.students.LOW || []),
  ];

  const student = allStudents.find(
    (item) => item.student_id === studentId
  );

  if (!student) {
    throw new Error("Student not found");
  }

  return {
    student_id: student.student_id,
    student_name: student.student_name,
    risk_level: student.risk_level,
    performance_trend: "DECLINING",
    intervention: student.intervention,
    ai_suggestion: student.ai_analysis,
  };
}