const API_BASE_URL = "http://127.0.0.1:8000/api";

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

/**
 * Get complete teacher analytics.
 *
 * Backend:
 * GET /api/teacher/analytics
 */
export async function getTeacherAnalytics() {
  if (!analyticsCache) {
    analyticsCache = await apiGet("/teacher/analytics");
  }

  return analyticsCache;
}

/**
 * Teacher profile.
 *
 * Currently using temporary static data.
 */
export async function getTeacherProfile() {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    throw new Error("No logged-in user found.");
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch {
    throw new Error("Invalid stored user information.");
  }

  if (user.role !== "teacher") {
    throw new Error("Logged-in user is not a teacher.");
  }

  return {
    teacher_name: user.full_name,
    teacher_id: user.user_id,
    department: user.department || "AI & Data Science",
  };
}


/**
 * Get risk distribution summary.
 */
export async function getRiskSummary() {
  const data = await getTeacherAnalytics();

  return {
    high: data.risk_summary?.HIGH ?? 0,
    medium: data.risk_summary?.MEDIUM ?? 0,
    low: data.risk_summary?.LOW ?? 0,
  };
}

/**
 * Get performance trend for all students.
 *
 * Uses the actual values returned by the risk engine.
 */
export async function getPerformanceTrend() {
  const data = await getTeacherAnalytics();

  const allStudents = [
    ...(data.students?.HIGH || []),
    ...(data.students?.MEDIUM || []),
    ...(data.students?.LOW || []),
  ];

  return allStudents.map((student) => ({
    student_id: student.student_id,
    student_name: student.student_name,
    trend_score: student.trend_score ?? 0,
    trend:
      student.performance_trend ??
      student.trend ??
      "STABLE",
  }));
}

/**
 * Get students belonging to a particular risk category.
 *
 * Example:
 * getStudentsByRisk("HIGH")
 */
export async function getStudentsByRisk(riskLevel) {
  const data = await getTeacherAnalytics();

  const normalizedRisk = riskLevel?.toUpperCase();

  if (!["HIGH", "MEDIUM", "LOW"].includes(normalizedRisk)) {
    throw new Error("Risk must be HIGH, MEDIUM or LOW.");
  }

  return (data.students?.[normalizedRisk] || []).map((student) => ({
    student_id: student.student_id,
    student_name: student.student_name,
    risk_level: student.risk_level,
  }));
}

/**
 * Get details of one student.
 *
 * Backend:
 * GET /api/teacher/students/{student_id}
 */
export async function getStudentDetails(studentId) {
  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  const data = await apiGet(
    `/teacher/students/${encodeURIComponent(studentId)}`
  );

  /*
   * Normalize intervention so React never receives
   * an unexpected object/string structure.
   */
  const intervention = {
    reasons: Array.isArray(data.intervention?.reasons)
      ? data.intervention.reasons
      : [],

    recommendation:
      typeof data.intervention?.recommendation === "string"
        ? data.intervention.recommendation
        : "",
  };

  /*
   * Normalize AI analysis.
   *
   * If the AI returns an object, convert it to JSON text
   * so React can safely render it.
   */
  let aiAnalysis = "AI analysis is currently unavailable.";

  if (typeof data.ai_analysis === "string") {
    aiAnalysis = data.ai_analysis;
  } else if (data.ai_analysis) {
    aiAnalysis = JSON.stringify(
      data.ai_analysis,
      null,
      2
    );
  }

  return {
    student_id: data.student_id,
    student_name: data.student_name,
    risk_level: data.risk_level,

    performance_trend:
      data.performance_trend || "STABLE",

    intervention,

    ai_analysis: aiAnalysis,
  };
}

/**
 * Clear cached analytics.
 */
export function clearTeacherAnalyticsCache() {
  analyticsCache = null;
}