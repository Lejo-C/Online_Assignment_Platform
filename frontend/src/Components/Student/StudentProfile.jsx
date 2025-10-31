import React from 'react';

export default function StudentProfile() {
  const student = {
    name: 'Lejo',
    email: 'lejo@student.edu',
    role: 'Student',
    joined: 'August 2024',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'Backend-first optimizer. Loves clean schemas, robust workflows, and playful UI.',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
        <div className="flex flex-col md:flex-row">
          {/* Avatar Section */}
          <div className="md:w-1/3 bg-gradient-to-tr from-indigo-500 to-purple-600 p-6 flex items-center justify-center">
            <img
              src={student.avatar}
              alt="Student Avatar"
              className="rounded-full w-40 h-40 border-4 border-white shadow-lg transform transition duration-500 hover:scale-105"
            />
          </div>

          {/* Info Section */}
          <div className="md:w-2/3 p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{student.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{student.role} • Joined {student.joined}</p>
            <p className="text-gray-700 mb-6">{student.bio}</p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email</span>
                <span className="text-indigo-600 font-medium">{student.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-green-500 font-semibold">Active</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 hover:scale-105 transition-all duration-300">
                Edit Profile
              </button>
              <button className="px-6 py-2 bg-pink-500 text-white rounded-full shadow-md hover:bg-pink-600 hover:scale-105 transition-all duration-300">
                View Exams
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
