/**
 * authService.js
 * ----------------------------------------------------------------
 * This file is the ONLY place in the frontend that "talks" to
 * authentication. Right now it contains a MOCK implementation so the
 * Login page has something to call and can demonstrate the intended
 * navigation flow.
 *
 * IMPORTANT:
 * - No real student IDs, teacher IDs or passwords are stored here.
 * - This mock never actually validates identity — it only simulates a
 *   network delay and always succeeds, purely so the UI/UX (loading
 *   state, redirect behaviour) can be reviewed before a backend exists.
 *
 * WHEN THE BACKEND IS READY:
 * Replace only the inside of `submitLogin` with a real fetch/axios call
 * to your API, for example:
 *
 *   export async function submitLogin(role, id, password) {
 *     const response = await fetch("/api/auth/login", {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify({ role, id, password }),
 *     });
 *     if (!response.ok) throw new Error("Invalid credentials");
 *     return response.json(); // e.g. { token, role, redirectTo }
 *   }
 *
 * Because every part of the Login page calls `submitLogin(...)` and
 * reacts to a resolved/rejected promise, nothing else in the UI needs
 * to change when the mock is swapped for the real API.
 */

const MOCK_NETWORK_DELAY_MS = 900;

/**
 * @param {"student"|"teacher"} role
 * @param {string} id - Student ID or Teacher ID, entered by the user
 * @param {string} password
 * @returns {Promise<{ role: string, redirectTo: string }>}
 */
export function submitLogin(role, id, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // --- MOCK ONLY: no real validation happens here ---
      if (!id.trim() || !password.trim()) {
        reject(new Error("Please enter both an ID and a password."));
        return;
      }

      resolve({
        role,
        redirectTo: role === "teacher" ? "/teacher/dashboard" : "/student/dashboard",
      });
    }, MOCK_NETWORK_DELAY_MS);
  });
}
