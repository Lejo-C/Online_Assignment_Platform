import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
});

export default function MonitorStudent() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [videoFrame, setVideoFrame] = useState('');

  // Fetch active students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/exams/active-students', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch students');
        const data = await res.json();
        console.log('✅ Active students:', data);
        setStudents(data);
      } catch (err) {
        console.error('❌ Error fetching students:', err);
      }
    };

    fetchStudents();
  }, []);

  // Listen for video frames
  useEffect(() => {
    if (!selectedStudent || typeof selectedStudent !== 'string') {
      console.warn('⚠️ No valid student ID — cannot join room');
      return;
    }

    console.log('📡 Joining room:', selectedStudent);
    socket.emit('join-room', { studentId: selectedStudent });

    const handleFrame = (frame) => {
      console.log('🎥 Received frame for', selectedStudent);
      setVideoFrame(frame);
    };

    socket.on('video-frame', handleFrame);

    return () => {
      socket.off('video-frame', handleFrame);
    };
  }, [selectedStudent]);

  return (
    <div className="container mt-5">
      <h2 className="h4 fw-bold text-primary text-center mb-4">🎥 Monitor Students</h2>

      <div className="d-flex flex-wrap gap-3 justify-content-center mb-4">
        {students.length === 0 ? (
          <p className="text-muted">No active students found.</p>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className={`border rounded p-3 text-center shadow-sm ${
                selectedStudent === student.id ? 'bg-primary text-white' : 'bg-light'
              }`}
              style={{ width: '150px', cursor: 'pointer' }}
              onClick={() =>
                setSelectedStudent((prev) => (prev === student.id ? '' : student.id))
              }
            >
              <strong>{student.name}</strong>
            </div>
          ))
        )}
      </div>

      {selectedStudent ? (
        <div className="text-center">
          <h5 className="mb-3 text-success">
            Live feed from <strong>{students.find(s => s.id === selectedStudent)?.name}</strong>
          </h5>
          {videoFrame ? (
            <img
              src={videoFrame}
              alt="Live feed"
              className="border rounded shadow"
              style={{ width: '480px', maxWidth: '100%' }}
            />
          ) : (
            <p className="text-muted">Waiting for video stream...</p>
          )}
        </div>
      ) : (
        <p className="text-center text-muted">Select a student to monitor their webcam.</p>
      )}
    </div>
  );
}
