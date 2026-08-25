import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import TeacherWelcome from "./pages/teachers-dash/TeacherWelcome";
import TeacherAnalytics from "./pages/teachers-dash/TeacherAnalytics";
import StudentDashboard from "./pages/Student/StudentDashboard";
import ParentDashboard from "./pages/Parent/ParentDashboard";
import InterestPlus from "./pages/Student/InterestPlus";
import InterestQuestions from "./pages/Student/InterestQuestions";
import InterestResult from "./pages/Student/InterestResult";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Teacher routes */}
        <Route path="/teacher/dashboard" element={<TeacherWelcome />} />
        <Route path="/teacher/analytics" element={<TeacherAnalytics />} />

        {/* Student routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/interest" element={<InterestPlus />} />
        <Route
          path="/student/interest/questions"
          element={<InterestQuestions />}
        />
        <Route path="/student/interest/result" element={<InterestResult />} />

        {/* Parent routes */}
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
