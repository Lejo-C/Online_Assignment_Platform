import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ViewStudents from './ViewStudents';
import CreateExam from './CreateExam';
import AssignedExams from './AssignedExams';
import FlaggedIncidents from './FlaggedIncidents';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Admin parent route */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="view-students" element={<ViewStudents />} />
        <Route path="create-exam" element={<CreateExam />} />
        <Route path="assigned-exams" element={<AssignedExams />} />
        <Route path="flagged-incidents" element={<FlaggedIncidents />} />
      </Route>
    </Routes>
  );
}
