import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    gender: '',
    dob: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/admin/users/${id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        
        if (res.ok) {
          setForm({
            name: data.name || '',
            email: data.email || '',
            gender: data.gender || '',
            dob: data.dob ? data.dob.slice(0, 10) : '',
          });
        } else {
          throw new Error(data.error || 'Failed to load user');
        }
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
    setLoading(true);

    try {
      // ✅ Convert gender to lowercase before sending
      const userData = {
        ...form,
        email: form.email.toLowerCase(),
        gender: form.gender.toLowerCase(),
      };

      const res = await fetch(`${apiUrl}/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Update failed');
      }

      alert('✅ Student updated successfully!');
      navigate('/admin/view-students');
    } catch (err) {
      console.error('❌ Failed to update user:', err);
      alert(err.message || 'Could not update student.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="h4 fw-bold mb-4 text-primary">✏️ Edit Student</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input 
            type="text"
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            className="form-control" 
            required 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input 
            type="email"
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            className="form-control" 
            required 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select 
            name="gender" 
            value={form.gender} 
            onChange={handleChange} 
            className="form-select" 
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input 
            type="date" 
            name="dob" 
            value={form.dob} 
            onChange={handleChange} 
            className="form-control" 
            required 
          />
        </div>

        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '💾 Saving...' : '💾 Save Changes'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/admin/view-students')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}