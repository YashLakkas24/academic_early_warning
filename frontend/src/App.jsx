import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import TeacherDashboard from "./pages/teachers-dash/TeacherWelcome";
import TeacherAnalytics from './pages/teachers-dash/TeacherAnalytics';
import StudentDashboard from "./pages/Student/StudentDashboard";
import ParentDashboard from "./pages/Parent/ParentDashboard";
import InterestPlus from "./pages/Student/InterestPlus";
import InterestQuestions from "./pages/Student/InterestQuestions"; 

/**
 * App.jsx only defines routes — no page content lives here.
 * This keeps the file small and makes it obvious where every URL leads.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        {/* Placeholder routes only — dashboards are built in a future task */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="/student/interest" element={<InterestPlus />} />
        <Route
          path="/student/interest/questions"
          element={<InterestQuestions />}
        />
        <Route
          path="/student/interest/result"
          element={
            <div style={{ padding: "40px", color: "white" }}>
              Interest analysis will appear here.
            </div>
          }
        />{" "}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
