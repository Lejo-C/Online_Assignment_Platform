import React, { useEffect, useState, useRef } from 'react';

export default function StudentProfile() {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', avatar: null });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/auth/me', {
                    credentials: 'include',
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to load profile');
                setStudent(data);
                setFormData({ name: data.name, email: data.email });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, avatar: file }));
            setPreviewUrl(URL.createObjectURL(file)); // ✅ generate preview
        }
    };



    const handleSave = async () => {
        try {
            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('email', formData.email);
            if (formData.avatar) {
                payload.append('avatar', formData.avatar);
            }

            const res = await fetch('http://localhost:5000/api/profile/update', {
                method: 'PUT',
                credentials: 'include',
                body: payload,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Update failed');

            // ✅ Merge user and profile into one object
            const updatedStudent = {
                ...data.user,
                avatar: data.profile?.avatar,
                joined: data.profile?.joined,
            };

            setStudent(updatedStudent);
            setEditing(false);
            setPreviewUrl(''); // ✅ clear preview after save
            setSuccess('Profile updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        }
    };


    if (loading) return <p className="text-center text-gray-500 mt-10">⏳ Loading profile...</p>;
    if (error || !student) return <p className="text-center text-red-600 mt-10">❌ {error || 'Profile not found'}</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6 flex items-center justify-center">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
                <div className="flex flex-col md:flex-row">
                    {/* Avatar Section */}
                    <div className="md:w-1/3 bg-gradient-to-tr from-indigo-500 to-purple-600 p-6 flex flex-col items-center justify-center">
                        <img
                            src={previewUrl || student.avatar}
                            alt="Student Avatar"
                            className="rounded-full w-40 h-40 border-4 border-white shadow-lg transform transition duration-500 hover:scale-105 mb-4 cursor-pointer"
                            onClick={() => editing && fileInputRef.current?.click()}
                        />


                        {editing && (
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        )}
                    </div>


                    {/* Info Section */}
                    <div className="md:w-2/3 p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {editing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                                />
                            ) : (
                                student.name
                            )}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            {student.role || 'Student'}
                        </p>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Email</span>
                                {editing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                                    />
                                ) : (
                                    <span className="text-indigo-600 font-medium">{student.email}</span>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Status</span>
                                <span className="text-green-500 font-semibold">Active</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-wrap gap-4">
                            {editing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-2 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 hover:scale-105 transition-all duration-300"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditing(false)}
                                        className="px-6 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 hover:scale-105 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 hover:scale-105 transition-all duration-300"
                                >
                                    Edit Profile
                                </button>
                            )}

                            <button
                                onClick={() => window.location.href = '/forgot-password'}
                                className="px-6 py-2 bg-yellow-500 text-white rounded-full shadow-md hover:bg-yellow-600 hover:scale-105 transition-all duration-300"
                            >
                                Forgot Password
                            </button>

                            

                            <button onClick={() => window.location.href = '/exam'} className="px-6 py-2 bg-pink-500 text-white rounded-full shadow-md hover:bg-pink-600 hover:scale-105 transition-all duration-300">
                                View Exams
                            </button>
                        </div>


                        {success && <p className="mt-4 text-green-600">{success}</p>}
                        {error && <p className="mt-4 text-red-600">{error}</p>}
                    </div>

                </div>
            </div>
<button
  onClick={async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      window.location.href = '/login';
    } catch (err) {
      alert('Logout failed');
    }
  }}
  className="absolute bottom-6 left-6 px-5 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300"
>
  Logout
</button>

        </div>
    );
}
