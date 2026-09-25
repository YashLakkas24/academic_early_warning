/**
 * Fetch student's notice personalization preferences.
 */


/**
 * Update student's notice personalization preferences.
 */
export async function updateStudentPreferences(studentId, preferences) {
  const cleanId = (studentId || "").trim().toUpperCase();

  if (!cleanId) {
    throw new Error("Student ID is required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/students/${encodeURIComponent(cleanId)}/preferences`,
    {
      method: "PUT",
      headers: await getAuthHeaders(true),
      body: JSON.stringify({
        preferences,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to update preferences (${response.status}): ${errorText}`,
    );
  }

  return await response.json();
}
