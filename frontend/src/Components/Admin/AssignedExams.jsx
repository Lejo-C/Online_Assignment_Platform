import { useEffect, useState } from 'react';

export default function AssignedExams() {
  const [exams, setExams] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    difficulty: '',
    type: '',
    schedule: '',
    duration: '',
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/exams/assigned', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Unauthorized or failed to fetch');
      const data = await res.json();
      setExams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error fetching exams:', err);
      setExams([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/exams/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      fetchExams();
    } catch (err) {
      console.error('❌ Error deleting exam:', err);
    }
  };

  const handleEdit = (exam) => {
    setEditId(exam._id);
    setForm({
      name: exam.name,
      difficulty: exam.difficulty,
      type: exam.type,
      schedule: exam.schedule?.slice(0, 16) || '',
      duration: exam.duration || '',
    });
  };

  const handleUpdate = async () => {
    try {
      await fetch(`http://localhost:5000/api/exams/update/${editId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setEditId(null);
      fetchExams();
    } catch (err) {
      console.error('❌ Error updating exam:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="h4 fw-bold mb-3">Assigned Exams</h2>
      <table className="table table-bordered table-hover bg-white">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Difficulty</th>
            <th>Type</th>
            <th>Schedule</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.length > 0 ? (
            exams.map((exam) => (
              <tr key={exam._id}>
                <td>{exam.name}</td>
                <td>{exam.difficulty}</td>
                <td>{exam.type}</td>
                <td>{new Date(exam.schedule).toLocaleString()}</td>
                <td>{exam.duration} min</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(exam)}>
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(exam._id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted">No exams assigned.</td>
            </tr>
          )}
        </tbody>
      </table>

      {editId && (
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">Edit Exam</h5>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Exam Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <select
              className="form-select mb-2"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              <option value="">Select Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select
              className="form-select mb-2"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="MCQ">Multiple Choice</option>
              <option value="TrueFalse">True/False</option>
            </select>
            <input
              type="datetime-local"
              className="form-control mb-2"
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
            />
            <input
              type="number"
              className="form-control mb-3"
              placeholder="Duration in minutes"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              required
            />
            <button className="btn btn-success w-100" onClick={handleUpdate}>
              <i className="bi bi-save me-2"></i>Update Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
