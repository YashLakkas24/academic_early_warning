/**
 * teacherService.js
 * ---------------------------------------------------------------------
 * Single point of contact between the Teacher Dashboard UI and the
 * backend. Every function below returns a Promise so swapping the
 * mock implementation for real `fetch` calls later requires no changes
 * in any component — only the bodies of these functions change.
 *
 * Expected backend data shapes are documented above each function.
 * ---------------------------------------------------------------------
 */

import {
  mockTeacherProfile,
  mockRiskSummary,
  mockPerformanceTrend,
  mockStudentsByRisk,
  mockStudentDetails,
} from './mockData';

// Toggle this off once real endpoints exist. Kept in one place so the
// switch-over is a one-line change.
const USE_MOCK = true;

// Base URL for the real API. Read from environment so it can differ
// between local development, staging, and production builds.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const MOCK_DELAY_MS = 450;

function mockResolve(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  return response.json();
}

/**
 * GET teacher profile for the currently logged-in teacher.
 * Expected shape:
 * { teacher_name: string, teacher_id: string, department: string }
 */
export function getTeacherProfile() {
  if (USE_MOCK) return mockResolve(mockTeacherProfile);
  return apiGet('/teacher/profile');
}

/**
 * GET the current class-wide risk distribution.
 * Expected shape:
 * { high: number, medium: number, low: number }
 */
export function getRiskSummary() {
  if (USE_MOCK) return mockResolve(mockRiskSummary);
  return apiGet('/teacher/risk-summary');
}

/**
 * GET performance trend points, one per student.
 * Expected shape (array):
 * [{ student_id, student_name, trend_score, trend }]
 * trend is one of "IMPROVING" | "STABLE" | "DECLINING".
 */
export function getPerformanceTrend() {
  if (USE_MOCK) return mockResolve(mockPerformanceTrend);
  return apiGet('/teacher/performance-trend');
}

/**
 * GET students belonging to a given risk level.
 * riskLevel: "HIGH" | "MEDIUM" | "LOW"
 * Expected shape (array):
 * [{ student_id, student_name, risk_score }]
 */
export function getStudentsByRisk(riskLevel) {
  if (USE_MOCK) return mockResolve(mockStudentsByRisk[riskLevel] || []);
  return apiGet(`/teacher/students?risk=${encodeURIComponent(riskLevel)}`);
}

/**
 * GET full detail for a single student, including the AI-generated
 * intervention and suggestion.
 * Expected shape:
 * {
 *   student_id, student_name, risk_level, risk_score,
 *   performance_trend, intervention, ai_suggestion
 * }
 */
export function getStudentDetails(studentId) {
  if (USE_MOCK) return mockResolve(mockStudentDetails[studentId] || null);
  return apiGet(`/teacher/students/${encodeURIComponent(studentId)}`);
}
