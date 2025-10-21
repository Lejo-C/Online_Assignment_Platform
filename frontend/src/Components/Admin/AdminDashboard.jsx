import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

 return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <aside className="bg-white border-end p-4" style={{ width: '260px' }}>
        <h2 className="h5 fw-bold mb-4">Admin Panel</h2>
        <div className="d-grid gap-3">
          <button
            onClick={() => navigate('/admin/view-students')}
            className="btn btn-outline-primary text-start"
          >
            <i className="bi bi-people-fill me-2"></i>
            View Students
          </button>

          <button
            onClick={() => navigate('/admin/view-result')}
            className="btn btn-outline-success text-start"
          >
            <i className="bi bi-bar-chart-line-fill me-2"></i>
            View Result
          </button>

          <button
            onClick={() => navigate('/admin/create-exam')}
            className="btn btn-outline-warning text-start"
          >
            <i className="bi bi-journal-plus me-2"></i>
            Create Exam
          </button>

          {/* Proctor Tools */}
          <button
            onClick={() => navigate('/admin/assigned-exams')}
            className="btn btn-outline-primary text-start"
          >
            <i className="bi bi-list-check me-2"></i>
            View Assigned Exams
          </button>

          <button
            onClick={() => navigate('/proctor/monitor')}
            className="btn btn-outline-info text-start"
          >
            <i className="bi bi-eye-fill me-2"></i>
            Monitor Students
          </button>

          <button
            onClick={() => navigate('/admin/flagged-incidents')}
            className="btn btn-outline-danger text-start"
          >
            <i className="bi bi-flag-fill me-2"></i>
            Flagged Incidents
          </button>

          <button
            onClick={() => navigate('/proctor/logs')}
            className="btn btn-outline-secondary text-start"
          >
            <i className="bi bi-journal-text me-2"></i>
            Review Logs
          </button>

          
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-5">
        <h1 className="display-6 fw-bold mb-3">Welcome, Admin!</h1>
        <p className="text-muted">
          Use the sidebar to manage students, exams, results, and proctor tools.
        </p>
      </main>
    </div>
  );
}