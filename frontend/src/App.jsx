import { useState } from 'react';
import './App.css';
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
import FlaggedIncidents from './Components/Admin/FlaggedIncidents.jsx';
import MonitorStudent from './Components/Admin/MonitorStudent.jsx';
import ResultPage from './Components/Student/ResultPage.jsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/admin/view-students" element={<ManageUsers />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/create-exam" element={<CreateExam />} />
        <Route path="/admin/assigned-exams" element={<AssignedExams />} />
        <Route path="/exam/instructions/:examId" element={<ExamInstructions />} />
        <Route path="/student/attempt/:examId/:attemptId" element={<AttemptExam />} />
        <Route path="/exam" element={<ScheduledExams />} />
        <Route path="/admin/flagged-incidents" element={<FlaggedIncidents />} />
        <Route path="/admin/monitor-student" element={<MonitorStudent />} />
        <Route path="/student/result/:attemptId" element={<ResultPage />} />

      </Routes>
    </>
  );
}

export default App;
