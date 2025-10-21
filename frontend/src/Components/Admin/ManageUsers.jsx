import { useEffect, useState } from 'react';

export default function ViewStudents() {
  const [students, setStudents] = useState([]);

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
