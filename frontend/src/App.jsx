import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";

import TeacherWelcome from "./pages/teachers-dash/TeacherWelcome";
import TeacherAnalytics from "./pages/teachers-dash/TeacherAnalytics";

import StudentDashboard from "./pages/Student/StudentDashboard";

import InterestPlus from "./pages/Student/InterestPlus";
import InterestQuestions from "./pages/Student/InterestQuestions";
import InterestResult from "./pages/Student/InterestResult";
import SkillGap from "./pages/Student/SkillGap";
import StudentRoadmap from "./pages/Student/StudentRoadmap";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================================================
            PUBLIC ROUTES
        ================================================== */}

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />


        {/* ==================================================
            TEACHER ROUTES
        ================================================== */}

        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherWelcome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/analytics"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherAnalytics />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            STUDENT ROUTES
        ================================================== */}

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/interest"
          element={
            <ProtectedRoute allowedRole="student">
              <InterestPlus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/interest/questions"
          element={
            <ProtectedRoute allowedRole="student">
              <InterestQuestions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/interest/result"
          element={
            <ProtectedRoute allowedRole="student">
              <InterestResult />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/skills"
          element={
            <ProtectedRoute allowedRole="student">
              <SkillGap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/skill-gap"
          element={
            <ProtectedRoute allowedRole="student">
              <SkillGap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/roadmap"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentRoadmap />
            </ProtectedRoute>
          }
        />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
