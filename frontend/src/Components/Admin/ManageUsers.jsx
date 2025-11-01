import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'animate.css';

export default function ViewStudents() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/users', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        const filtered = data.filter((user) => user.role === 'student');
        setStudents(filtered);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');

      setStudents((prev) => prev.filter((student) => student._id !== id));
      alert('✅ Student deleted successfully!');
    } catch (err) {
      console.error('❌ Failed to delete user:', err);
      alert('Could not delete student.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-user/${id}`);
  };

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
  <h2 className="h4 fw-bold mb-4 text-primary text-center text-md-start animate__animated animate__fadeInDown">
    🎓 Student List
  </h2>

  <div className="table-responsive animate__animated animate__fadeInUp">
    <table className="table table-bordered table-hover bg-white shadow-sm align-middle">
      <thead className="table-primary">
        <tr>
          <th className="text-nowrap">Name</th>
          <th className="text-nowrap">Email</th>
          <th className="text-nowrap">Gender</th>
          <th className="text-nowrap">Date of Birth</th>
          <th className="text-nowrap">Role</th>
          <th className="text-nowrap">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.length > 0 ? (
          students.map((student) => (
            <tr key={student._id}>
              <td className="text-break">{student.name}</td>
              <td className="text-break">{student.email}</td>
              <td>{student.gender}</td>
              <td>{new Date(student.dob).toLocaleDateString()}</td>
              <td>
                <span className="badge bg-success">{student.role}</span>
              </td>
              <td>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEdit(student._id)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(student._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center text-muted">
              No students found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  );
}
