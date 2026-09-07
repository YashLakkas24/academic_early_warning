import { getAuth } from "firebase/auth";
import app from "../firebase";

const API_BASE_URL = "http://127.0.0.1:8000/api";
const auth = getAuth(app);

async function getAuthHeaders() {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You are not authenticated. Please log in again.");
  }

  const token = await currentUser.getIdToken();

  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}
// =========================================================
// BASIC GET REQUEST
// =========================================================
async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    let errorMessage = `Request to ${path} failed with status ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        errorMessage = errorData.detail;
      }
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

// =========================================================
// ANALYTICS CACHE
// =========================================================
//
// IMPORTANT:
// This cache stores ONLY the teacher analytics response.
//
// It does NOT contain AI student details.
//
// AI analysis is requested separately when a student
// is opened.
//

let analyticsCache = null;

// =========================================================
// GET TEACHER ANALYTICS
// =========================================================
//
// Backend:
// GET /api/teacher/analytics
//
// This endpoint should be fast because it does NOT
// generate AI analysis.
//

export async function getTeacherAnalytics() {
  if (analyticsCache !== null) {
    return analyticsCache;
  }

  const data = await apiGet("/teacher/analytics");

  analyticsCache = data;

  return data;
}

// =========================================================
// GET TEACHER PROFILE
// =========================================================
//
// Currently reads logged-in teacher information
// from localStorage.
//

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
    teacher_name: user.full_name || user.name || "Teacher",

    teacher_id: user.user_id || user.id || "",

    department: user.department || "AI & Data Science",
  };
}

// =========================================================
// GET RISK SUMMARY
// =========================================================
//
// Returns:
// {
//   high: 1,
//   medium: 4,
//   low: 5
// }
//

export async function getRiskSummary() {
  const data = await getTeacherAnalytics();

  return {
    high: Number(data?.risk_summary?.HIGH ?? 0),
    medium: Number(data?.risk_summary?.MEDIUM ?? 0),
    low: Number(data?.risk_summary?.LOW ?? 0),
  };
}

// =========================================================
// GET PERFORMANCE TREND
// =========================================================

export async function getPerformanceTrend() {
  const data = await getTeacherAnalytics();

  const allStudents = [
    ...(data?.students?.HIGH || []),
    ...(data?.students?.MEDIUM || []),
    ...(data?.students?.LOW || []),
  ];

  return allStudents.map((student) => ({
    student_id: student.student_id,

    student_name: student.student_name || student.name || "Unknown Student",

    trend_score: student.trend_score ?? student.risk_score ?? 0,

    trend: student.performance_trend || student.trend || "STABLE",
  }));
}

// =========================================================
// GET STUDENTS BY RISK
// =========================================================
//
// Example:
// getStudentsByRisk("HIGH")
//
// IMPORTANT:
// This does NOT call AI.
//

export async function getStudentsByRisk(riskLevel) {
  const normalizedRisk = String(riskLevel || "").toUpperCase();

  if (!["HIGH", "MEDIUM", "LOW"].includes(normalizedRisk)) {
    throw new Error("Risk must be HIGH, MEDIUM or LOW.");
  }

  const data = await getTeacherAnalytics();

  const students = data?.students?.[normalizedRisk] || [];

  return students.map((student) => ({
    student_id: student.student_id,

    student_name: student.student_name || student.name || "Unknown Student",

    risk_level: student.risk_level || normalizedRisk,

    risk_score: student.risk_score ?? 0,

    performance_trend: student.performance_trend || student.trend || "STABLE",
  }));
}


// =========================================================
// GET ONE STUDENT DETAILS
// =========================================================
//
// Backend:
// GET /api/teacher/students/{student_id}
//
// IMPORTANT:
// THIS is the only request that triggers AI analysis.
//
// So:
// Analytics page  -> NO AI
// Risk list       -> NO AI
// Click Arjun     -> AI runs for Arjun only
// Click Sneha     -> AI runs for Sneha only


export async function getStudentDetails(studentId) {
  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  const data = await apiGet(
    `/teacher/students/${encodeURIComponent(studentId)}`,
  );

  // =======================================================
  // NORMALIZE INTERVENTION
  // =======================================================

  const rawIntervention = data?.intervention;

  const interventionReasons = Array.isArray(rawIntervention?.reasons)
    ? rawIntervention.reasons
    : typeof rawIntervention === "string"
      ? rawIntervention.reasons
        .split("\n")
        .map((reason) => reason.trim())
        .filter(Boolean)
      : [];

  const interventionRecommendation =
    typeof rawIntervention?.recommendation === "string"
      ? rawIntervention.recommendation.trim()
      : "";

  const intervention = {
    reasons: interventionReasons,

    recommendation: interventionRecommendation,
  };

  // =======================================================
  // NORMALIZE AI SUGGESTION
  // =======================================================


  let aiSuggestion = "";

  if (typeof data?.ai_analysis === "string") {
    aiSuggestion = data.ai_analysis.trim();
  } else if (data?.ai_analysis && typeof data.ai_analysis === "object") {
    aiSuggestion =
      data.ai_analysis.recommendation || data.ai_analysis.suggestion || "";
  }

  // =======================================================
  // FALLBACK
  // =======================================================

  if (!aiSuggestion) {
    aiSuggestion = "AI analysis is currently unavailable.";
  }

  // =======================================================
  // FINAL NORMALIZED RESPONSE
  // =======================================================
  //
  // Both ai_analysis and ai_suggestion are returned.
  //
  // This makes the frontend compatible with either:
  //
  // student.ai_analysis
  //
  // OR
  //
  // student.ai_suggestion
  //

  return {
    student_id: data.student_id,

    student_name: data.student_name || "Unknown Student",

    risk_level: data.risk_level || "LOW",

    performance_trend: data.performance_trend || "STABLE",

    analysis: typeof data.analysis === "string" ? data.analysis.trim() : "",

    intervention,

    // Explicit name for future use
    ai_suggestion: aiSuggestion,
  };
}

// =========================================================
// CLEAR ANALYTICS CACHE
// =========================================================
//
// Call this after changing/re-uploading the CSV or
// whenever fresh risk calculations are required.
//

export function clearTeacherAnalyticsCache() {
  analyticsCache = null;
}

// =========================================================
// OPTIONAL: FORCE REFRESH ANALYTICS
// =========================================================
//
// Useful after modifying the dataset.
//

export async function refreshTeacherAnalytics() {
  analyticsCache = null;

  return getTeacherAnalytics();
}
