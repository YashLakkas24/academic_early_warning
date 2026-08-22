/**
 * mockData.js
 * ---------------------------------------------------------------------
 * TEMPORARY DEVELOPMENT DATA ONLY.
 *
 * This file exists purely so the Teacher Dashboard can be built and
 * demoed before the backend/database connection is wired up.
 *
 * Nothing in src/pages or src/components imports this file directly —
 * everything goes through src/services/teacherService.js. When the real
 * API is ready, this file can be deleted and teacherService.js can be
 * pointed at the live endpoints without touching a single component.
 * ---------------------------------------------------------------------
 */

export const mockTeacherProfile = {
  teacher_name: 'Aditi Rao',
  teacher_id: 'TCH-2044',
  department: 'AI & Data Science',
};

export const mockRiskSummary = {
  high: 7,
  medium: 13,
  low: 42,
};

// One entry per student who appears in the performance trend chart.
// trend_score is only used to position the dot above / on / below the
// stability line — it is not shown to the teacher directly.
export const mockPerformanceTrend = [
  { student_id: 'STU1024', student_name: 'Aarav Sharma', trend_score: -34, trend: 'DECLINING' },
  { student_id: 'STU1031', student_name: 'Riya Patel', trend_score: -21, trend: 'DECLINING' },
  { student_id: 'STU1042', student_name: 'Kabir Shah', trend_score: -12, trend: 'DECLINING' },
  { student_id: 'STU1058', student_name: 'Meera Iyer', trend_score: 4, trend: 'STABLE' },
  { student_id: 'STU1063', student_name: 'Devansh Rao', trend_score: -3, trend: 'STABLE' },
  { student_id: 'STU1077', student_name: 'Sana Sheikh', trend_score: 2, trend: 'STABLE' },
  { student_id: 'STU1081', student_name: 'Vivaan Nair', trend_score: 28, trend: 'IMPROVING' },
  { student_id: 'STU1090', student_name: 'Ishita Bose', trend_score: 19, trend: 'IMPROVING' },
  { student_id: 'STU1105', student_name: 'Kunal Verma', trend_score: 33, trend: 'IMPROVING' },
  { student_id: 'STU1118', student_name: 'Ananya Ghosh', trend_score: 12, trend: 'IMPROVING' },
];

export const mockStudentsByRisk = {
  HIGH: [
    { student_id: 'STU1024', student_name: 'Aarav Sharma', risk_score: 84 },
    { student_id: 'STU1031', student_name: 'Riya Patel', risk_score: 79 },
    { student_id: 'STU1042', student_name: 'Kabir Shah', risk_score: 76 },
  ],
  MEDIUM: [
    { student_id: 'STU1058', student_name: 'Meera Iyer', risk_score: 58 },
    { student_id: 'STU1063', student_name: 'Devansh Rao', risk_score: 55 },
    { student_id: 'STU1077', student_name: 'Sana Sheikh', risk_score: 51 },
  ],
  LOW: [
    { student_id: 'STU1081', student_name: 'Vivaan Nair', risk_score: 22 },
    { student_id: 'STU1090', student_name: 'Ishita Bose', risk_score: 18 },
  ],
};

export const mockStudentDetails = {
  STU1024: {
    student_id: 'STU1024',
    student_name: 'Aarav Sharma',
    risk_level: 'HIGH',
    risk_score: 84,
    performance_trend: 'DECLINING',
    intervention: 'Faculty discussion and attendance follow-up, with an assignment recovery plan for the next two weeks.',
    ai_suggestion: "This student's rising risk is associated with declining attendance and assignment completion. Monitor both indicators closely and initiate targeted academic support.",
  },
  STU1031: {
    student_id: 'STU1031',
    student_name: 'Riya Patel',
    risk_level: 'HIGH',
    risk_score: 79,
    performance_trend: 'DECLINING',
    intervention: 'Schedule a one-on-one check-in and review recent assessment scores together.',
    ai_suggestion: 'A consistent dip across the last three assessments suggests a subject-specific gap rather than a general decline. Recommend a focused subject review.',
  },
  STU1042: {
    student_id: 'STU1042',
    student_name: 'Kabir Shah',
    risk_level: 'HIGH',
    risk_score: 76,
    performance_trend: 'DECLINING',
    intervention: 'Coordinate with the counseling team and share updated attendance data with the student.',
    ai_suggestion: 'Attendance has dropped sharply in the last two weeks. Early outreach is recommended before the trend compounds further.',
  },
  STU1058: {
    student_id: 'STU1058',
    student_name: 'Meera Iyer',
    risk_level: 'MEDIUM',
    risk_score: 58,
    performance_trend: 'STABLE',
    intervention: 'Light-touch check-in during the next scheduled review cycle.',
    ai_suggestion: 'Performance has plateaued rather than declined. Continued observation is sufficient for now.',
  },
  STU1063: {
    student_id: 'STU1063',
    student_name: 'Devansh Rao',
    risk_level: 'MEDIUM',
    risk_score: 55,
    performance_trend: 'STABLE',
    intervention: 'Encourage participation in the upcoming peer study group.',
    ai_suggestion: 'Minor fluctuations across recent assignments fall within a normal range. No urgent action required.',
  },
  STU1077: {
    student_id: 'STU1077',
    student_name: 'Sana Sheikh',
    risk_level: 'MEDIUM',
    risk_score: 51,
    performance_trend: 'STABLE',
    intervention: 'Share supplementary practice material for the upcoming module.',
    ai_suggestion: 'Signals are borderline between medium and low risk. Recommend a follow-up check after the next assessment.',
  },
  STU1081: {
    student_id: 'STU1081',
    student_name: 'Vivaan Nair',
    risk_level: 'LOW',
    risk_score: 22,
    performance_trend: 'IMPROVING',
    intervention: 'No intervention required at this time.',
    ai_suggestion: 'Consistent improvement across the last four weeks. Consider highlighting this student as a peer mentor candidate.',
  },
  STU1090: {
    student_id: 'STU1090',
    student_name: 'Ishita Bose',
    risk_level: 'LOW',
    risk_score: 18,
    performance_trend: 'IMPROVING',
    intervention: 'No intervention required at this time.',
    ai_suggestion: 'Strong upward trend in both attendance and assignment quality. No action needed.',
  },
};
