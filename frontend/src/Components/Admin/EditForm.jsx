import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    gender: '',
    dob: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/admin/users/${id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        setForm({
          name: data.name || '',
          email: data.email || '',
          gender: data.gender || '',
          dob: data.dob ? data.dob.slice(0, 10) : '',
        });
      } catch (err) {
        console.error('❌ Failed to load user:', err);
        alert('Could not load user details.');
        navigate('/admin/view-students');
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { 
      const res = await fetch(`${apiUrl}/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Update failed');
      alert('✅ Student updated successfully!');
      navigate('/admin/view-students');
    }
    catch (err) {
      console.error('❌ Failed to update user:', err);
      alert('Could not update student.');
    } 
  };


  return (
    <div className="container mt-4">
      <h2 className="h4 fw-bold mb-4 text-primary">✏️ Edit Student</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="form-select" required>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input type="date" name="dob" value={form.dob} onChange={handleChange} className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary">💾 Save Changes</button>
      </form>
    </div>
  );
}
