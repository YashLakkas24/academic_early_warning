const API_BASE_URL = "http://127.0.0.1:8000/api";

const STUDENT_DATABASE = {
  STU001: { student_id: "STU001", name: "Aarav Sharma", roll_number: "01", attendance: 92, previous_sem_cgpa: 8.4, extracurricular_count: 3 },
  STU002: { student_id: "STU002", name: "Riya Patil", roll_number: "02", attendance: 61, previous_sem_cgpa: 6.1, extracurricular_count: 1 },
  STU003: { student_id: "STU003", name: "Aditya Kulkarni", roll_number: "03", attendance: 88, previous_sem_cgpa: 8.0, extracurricular_count: 2 },
  STU004: { student_id: "STU004", name: "Sneha Joshi", roll_number: "04", attendance: 74, previous_sem_cgpa: 7.1, extracurricular_count: 3 },
  STU005: { student_id: "STU005", name: "Vedant Shah", roll_number: "05", attendance: 45, previous_sem_cgpa: 5.4, extracurricular_count: 0 },
  STU006: { student_id: "STU006", name: "Ananya Deshmukh", roll_number: "06", attendance: 96, previous_sem_cgpa: 9.1, extracurricular_count: 4 },
  STU007: { student_id: "STU007", name: "Rahul Mehta", roll_number: "07", attendance: 68, previous_sem_cgpa: 6.8, extracurricular_count: 2 },
  STU008: { student_id: "STU008", name: "Isha Gupta", roll_number: "08", attendance: 82, previous_sem_cgpa: 7.6, extracurricular_count: 3 },
  STU009: { student_id: "STU009", name: "Om More", roll_number: "09", attendance: 18, previous_sem_cgpa: 7.4, extracurricular_count: 2 },
  STU010: { student_id: "STU010", name: "Kavya Nair", roll_number: "10", attendance: 90, previous_sem_cgpa: 7.9, extracurricular_count: 4 },
};

/**
 * Fetch student profile details from FastAPI backend: GET /api/students/{student_id}
 */
export async function getStudentProfile(studentId) {
  const cleanId = (studentId || "").trim().toUpperCase();

  if (!cleanId) {
    throw new Error("Student ID is required.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/students/${encodeURIComponent(cleanId)}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("Backend API call failed, using student database fallback:", err);
  }

  // Database fallback matching create_students.py
  const matched = STUDENT_DATABASE[cleanId];
  if (matched) {
    return matched;
  }

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  return {
    student_id: cleanId,
    name: storedUser.full_name || `Student (${cleanId})`,
    roll_number: "01",
    attendance: 85,
    previous_sem_cgpa: 7.5,
    extracurricular_count: 2,
  };
}

/**
 * Check student Interest+ status: GET /api/students/{student_id}/interests/status
 */
export async function getStudentInterestStatus(studentId) {
  const cleanId = (studentId || "").trim().toUpperCase();
  if (!cleanId) return { completed: false, interests: [] };

  try {
    const response = await fetch(`${API_BASE_URL}/students/${encodeURIComponent(cleanId)}/interests/status`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("Backend interest status API call failed:", err);
  }

  return { completed: false, interests: [] };
}
/**
 * Fetch available interest options: GET /api/interests/options
 */
export async function getInterestOptions() {
  try {
    const response = await fetch(`${API_BASE_URL}/interests/options`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.options || [];
    }
  } catch (err) {
    console.warn("Failed to fetch interest options from API:", err);
  }

  return [
    "Government & Public Services",
    "IT & Technology",
    "Coding & Software",
    "Business & Entrepreneurship",
    "Finance",
    "Creative & Media",
    "Healthcare",
    "Education",
    "Law",
    "Marketing",
  ];
}

/**
 * Save selected student interest: POST /api/students/{student_id}/interests
 */
export async function saveStudentInterest(studentId, interest) {
  const cleanId = (studentId || "").trim().toUpperCase();
  if (!cleanId) throw new Error("Student ID is required.");

  const response = await fetch(`${API_BASE_URL}/students/${encodeURIComponent(cleanId)}/interests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ interest }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to save interest: ${errText}`);
  }

  return await response.json();
}

/**
 * Start or resume an Interest+ AI discovery session: POST /api/students/{student_id}/interest-session/start
 */
export async function startInterestSession(studentId, interest, reset = false) {
  const cleanId = (studentId || "").trim().toUpperCase();
  if (!cleanId) throw new Error("Student ID is required.");

  const response = await fetch(
    `${API_BASE_URL}/students/${encodeURIComponent(cleanId)}/interest-session/start?reset=${reset}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ interest }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to start interest session: ${errText}`);
  }

  return await response.json();
}

/**
 * Submit answer to current question and receive next AI question or final analysis:
 * POST /api/students/{student_id}/interest-session/answer
 */
export async function submitInterestAnswer(studentId, { interest, question_id, question, answer, question_order }) {
  const cleanId = (studentId || "").trim().toUpperCase();
  if (!cleanId) throw new Error("Student ID is required.");

  const response = await fetch(
    `${API_BASE_URL}/students/${encodeURIComponent(cleanId)}/interest-session/answer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        interest,
        question_id,
        question,
        answer,
        question_order,
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to submit answer: ${errText}`);
  }

  return await response.json();
}

/**
 * Fetch student's Interest+ AI analysis
 * GET /api/students/{student_id}/interest-analysis
 */
export async function getStudentInterestAnalysis(studentId) {
  const cleanId = (studentId || "").trim().toUpperCase();

  if (!cleanId) {
    throw new Error("Student ID is required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/students/${encodeURIComponent(cleanId)}/interest-analysis`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to fetch interest analysis (${response.status}): ${errorText}`
    );
  }

  return await response.json();
}