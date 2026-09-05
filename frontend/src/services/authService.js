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
const MOCK_STUDENTS = {
  STU001: { name: "Aarav Sharma" },
  STU002: { name: "Riya Patil" },
  STU003: { name: "Aditya Kulkarni" },
  STU004: { name: "Sneha Joshi" },
  STU005: { name: "Vedant Shah" },
  STU006: { name: "Ananya Deshmukh" },
  STU007: { name: "Rahul Mehta" },
  STU008: { name: "Isha Gupta" },
  STU009: { name: "Om More" },
  STU010: { name: "Kavya Nair" },
};

export async function submitLogin(role, id, password) {
  if (!id.trim() || !password.trim()) {
    throw new Error("Please enter both an ID and a password.");
  }

  const cleanId = id.trim().toUpperCase();

  let response;
  try {
    response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        user_id: cleanId,
        password: password,
        role: role,
      }),
    });
  } catch (networkErr) {
    throw new Error(
      "Cannot connect to the backend server. Please ensure FastAPI is running on http://127.0.0.1:8000."
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMsg = data?.detail || "Invalid ID or password.";
    throw new Error(errorMsg);
  }

  const user = {
    user_id: data.user_id,
    student_id: data.user_id,
    full_name: data.full_name,
    role: data.role,
  };
  localStorage.setItem("user", JSON.stringify(user));

  return {
    ...data,
    redirectTo:
      data.role === "teacher"
        ? "/teacher/dashboard"
        : "/student/dashboard",
  };
}