import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error('❌ Failed to delete student:', err);
      alert('Could not delete student.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-user/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="h4 fw-bold mb-3">Student List</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover bg-white">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.gender}</td>
                <td>{new Date(student.dob).toLocaleDateString()}</td>
                <td>{student.role}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(student._id)}>
                    ✏️ Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(student._id)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
