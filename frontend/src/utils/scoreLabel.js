/**
 * Converts an internal 0–1 score into a qualitative label for display.
 *
 * The Student Navigation Intelligence layer deliberately avoids showing
 * these as precise percentages or marks — they are an AI's interpretation
 * of open-ended responses, not a measurement. This keeps the language
 * consistent everywhere a score like this is shown.
 */
export function scoreToLabel(score) {
  if (score >= 0.75) return "High";
  if (score >= 0.45) return "Developing";
  return "Early stage";
}

/**
 * Converts a 0–1 score into a 0–10 bar-fill scale for the compact
 * segmented bars used in Interest Analysis.
 */
export function scoreToBars(score, totalBars = 10) {
  return Math.max(1, Math.round(score * totalBars));
}
