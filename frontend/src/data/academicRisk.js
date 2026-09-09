/**
 * academicRisk.js
 * ----------------------------------------------------------------
 * Mock data for the Academic Risk Intelligence layer of E.A.R.N.
 *
 * This is illustrative/demo data only — it is shaped the way a real
 * backend response is expected to look, so that swapping this file for
 * a fetch() call later requires no changes to the components that
 * consume it.
 */

export const academicRisk = {
  totalStudents: 62,
  highRisk: 7,
  mediumRisk: 13,
  stable: 42,
  classLabel: "Div. B, Sem IV",
  // Illustrative trajectory points for the compact line chart (not real scores)
  trajectory: [
    { label: "Assessment 01", value: 74 },
    { label: "Assessment 02", value: 70 },
    { label: "Assessment 03", value: 61 },
    { label: "Assessment 04", value: 66 },
    { label: "Assessment 05", value: 58 },
    { label: "Assessment 06", value: 64 },
    { label: "Assessment 07", value: 52 },
  ],
  riskFactors: [
    { label: "Attendance trend", detail: "Declining over the last 3 weeks" },
    { label: "Assessment trend", detail: "Two consecutive assessments below class average" },
    { label: "Assignment completion", detail: "3 of the last 5 assignments submitted late" },
  ],
  recommendedAction: "Schedule targeted academic support",
  signalSummary: "7 students may require attention",
};
