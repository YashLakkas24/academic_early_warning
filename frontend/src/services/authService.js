const API_URL = "http://127.0.0.1:8000";

/**
 * Login user through FastAPI backend.
 *
 * FastAPI checks:
 * 1. user_id against PostgreSQL
 * 2. password against password_hash
 * 3. selected role against database role
 *
 * After successful login, the returned user information
 * is saved in localStorage for the frontend.
 */
export async function submitLogin(role, id, password) {
  if (!id.trim() || !password.trim()) {
    throw new Error("Please enter both an ID and a password.");
  }

  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      user_id: id.trim(),
      password: password,
      role: role,
    }),
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response from backend.");
  }

  if (!response.ok) {
    throw new Error(
      data.detail || "Login failed. Please check your ID and password."
    );
  }

  // -------------------------------------------------------
  // Successful login
  // FastAPI returns:
  //
  // {
  //   message,
  //   user_id,
  //   full_name,
  //   role
  // }
  // -------------------------------------------------------

  const user = {
    user_id: data.user_id,
    full_name: data.full_name,
    role: data.role,
  };

  // Save the logged-in user for the dashboard
  localStorage.setItem("user", JSON.stringify(user));

  return {
    ...data,
    redirectTo:
      data.role === "teacher"
        ? "/teacher/dashboard"
        : "/student/dashboard",
  };
}