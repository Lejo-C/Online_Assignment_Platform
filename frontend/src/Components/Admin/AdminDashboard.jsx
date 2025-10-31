import { useNavigate } from 'react-router-dom';
import 'animate.css';
import { useState } from 'react';

export default function AdminDashboard() {
  const navigate = useNavigate();
   const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar((prev) => !prev);
  const examId = '652f1a1234567890abcdef12'; // Example ObjectId

    return (
    <div className="d-flex flex-column min-vh-100 bg-gradient bg-light animate__animated animate__fadeIn">
      {/* Top Navbar for mobile */}
      <nav className="d-md-none bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center shadow-sm">
        <h2 className="h5 fw-bold text-primary m-0">Admin Panel</h2>
        <button
          className="btn btn-outline-primary"
          onClick={toggleSidebar}
        >
          <i className="bi bi-list fs-4"></i>
        </button>
      </nav>

      <div className="d-flex flex-grow-1 flex-column flex-md-row">
        {/* Sidebar */}
        <aside
          className={`bg-white border-end p-4 shadow-sm w-100 w-md-25 animate__animated ${
            showSidebar ? 'animate__fadeInLeft' : 'd-none d-md-block'
          }`}
          style={{ maxWidth: '260px' }}
        >
          <h2 className="h5 fw-bold mb-4 text-primary">Admin Panel</h2>
          <div className="d-grid gap-3">
            <button onClick={() => navigate('/admin/view-students')} className="btn btn-outline-primary text-start">
              <i className="bi bi-people-fill me-2"></i> View Students
            </button>
            
            <button onClick={() => navigate('/admin/create-exam')} className="btn btn-outline-warning text-start">
              <i className="bi bi-journal-plus me-2"></i> Create Exam
            </button>
            <button onClick={() => navigate('/admin/assigned-exams')} className="btn btn-outline-primary text-start">
              <i className="bi bi-list-check me-2"></i> View Assigned Exams
            </button>
            
            <button onClick={() => navigate('/admin/flagged-incidents')} className="btn btn-outline-danger text-start">
              <i className="bi bi-flag-fill me-2"></i> Flagged Incidents
            </button>
            
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow-1 p-5 animate__animated animate__fadeInUp">
          <h1 className="display-6 fw-bold mb-3 text-dark">Welcome, Admin!</h1>
          <p className="text-muted fs-5">
            Use the sidebar to manage students, exams, results, and proctor tools.
          </p>
        </main>
      </div>
    </div>
  );
}
