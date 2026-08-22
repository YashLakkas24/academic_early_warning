const API_URL = "http://127.0.0.1:8000";


/**
 * Login user through FastAPI backend.
 *
 * @param {"student"|"teacher"} role
 * @param {string} id - Student ID or Teacher ID
 * @param {string} password
 * @returns {Promise<{ role: string, user_id: string, full_name: string, message: string }>}
 */
export async function submitLogin(role, id, password) {
  if (!id.trim() || !password.trim()) {
    throw new Error("Please enter both an ID and a password.");
  }

  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: id.trim(),
      password: password,
      role: role,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed. Please try again.");
  }

  return {
    ...data,
    redirectTo: data.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard",
  };
}