import { Routes, Route } from 'react-router-dom';
import Signup from './Components/Signup.jsx';
import Login from './Components/Login.jsx';
import StudentDashboard from './Components/Student/StudentDashboard.jsx';
import AdminDashboard from './Components/Admin/AdminDashboard.jsx';
import ManageUsers from './Components/Admin/ManageUsers.jsx';
import ResetPassword from './Components/ResetPassword.jsx';
import ForgotPassword from './Components/ForgotPassword.jsx';
import CreateExam from './Components/Admin/CreateExam.jsx';
import AssignedExams from './Components/Admin/AssignedExams.jsx';
import ExamInstructions from './Components/Student/ExamInstructions.jsx';
import AttemptExam from './Components/Student/AttemptExam.jsx';
import ScheduledExams from './Components/Student/ScheduledExams.jsx';
import ResultPage from './Components/Student/ResultPage.jsx';
import FlaggedIncidents from './Components/Admin/FlaggedIncidents.jsx';
import StudentProfile from './Components/Student/StudentProfile.jsx';
import EditUser from './Components/Admin/EditUser.jsx';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Student routes */}
      <Route path="/studentDashboard" element={<StudentDashboard />} />
      <Route path="/exam/instructions/:examId" element={<ExamInstructions />} />
      <Route path="/student/attempt/:examId/:attemptId" element={<AttemptExam />} />
      <Route path="/exam" element={<ScheduledExams />} />
      <Route path="/student/result/:attemptId" element={<ResultPage />} />
      <Route path="/profile" element={<StudentProfile />} />

      {/* Admin routes (nested under /admin) */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<p>Welcome, Admin!</p>} />
        <Route path="view-students" element={<ManageUsers />} />
        <Route path="create-exam" element={<CreateExam />} />
        <Route path="assigned-exams" element={<AssignedExams />} />
        <Route path="flagged-incidents" element={<FlaggedIncidents />} />
        <Route path="edit-user/:id" element={<EditUser />} />
      </Route>
    </Routes>
  );
}

export default App;
