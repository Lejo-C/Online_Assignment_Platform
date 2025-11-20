import React, { useEffect, useState } from 'react';
import 'animate.css';
const apiUrl = import.meta.env.VITE_API_URL;
import { useNavigate } from 'react-router-dom';

function FlaggedIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/incidents`, {
          credentials: 'include',
        });
        const data = await res.json();
        setIncidents(data);
      } catch (err) {
        console.error('❌ Error fetching incidents:', err);
      }
    };
    fetchIncidents();
  }, []);

  // ✅ Group incidents by exam → then by student
  const groupedByExam = incidents.reduce((acc, incident) => {
    const examName = incident.exam?.name || 'Deleted Exam';
    const studentName = incident.studentName || incident.studentId?.name || 'Unknown';

    if (!acc[examName]) acc[examName] = {};
    if (!acc[examName][studentName]) acc[examName][studentName] = [];
    acc[examName][studentName].push(incident);

    return acc;
  }, {});

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
      <h2 className="text-danger fw-bold mb-4 animate__animated animate__fadeInDown">
        🚨 Flagged Incidents
      </h2>

      {incidents.length === 0 ? (
        <p className="text-muted">No incidents found.</p>
      ) : (
        <div className="row">
          {/* Exam list */}
          <div className="col-12 col-md-4 mb-4 mb-md-0 animate__animated animate__fadeInLeft">
            <h5 className="text-primary fw-semibold mb-3">📚 Exams</h5>
            <ul className="list-group shadow-sm">
              {Object.keys(groupedByExam).map((examName) => (
                <li
                  key={examName}
                  className={`list-group-item list-group-item-action ${
                    selectedExam === examName ? 'active' : ''
                  }`}
                  onClick={() => {
                    setSelectedExam(examName);
                    setSelectedStudent(null); // reset student when switching exam
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {examName}
                </li>
              ))}
            </ul>
          </div>

          {/* Student + Incident view */}
          <div className="col-12 col-md-8 animate__animated animate__fadeInUp">
            {selectedExam ? (
              <>
                <h5 className="mt-3 text-success fw-semibold">
                  👤 Students flagged in {selectedExam}
                </h5>
                <ul className="list-group shadow-sm mb-3">
                  {Object.keys(groupedByExam[selectedExam]).map((studentName) => (
                    <li
                      key={studentName}
                      className={`list-group-item list-group-item-action ${
                        selectedStudent === studentName ? 'active' : ''
                      }`}
                      onClick={() => setSelectedStudent(studentName)}
                      style={{ cursor: 'pointer' }}
                    >
                      {studentName}
                    </li>
                  ))}
                </ul>

                {selectedStudent ? (
                  <>
                    <h6 className="mt-3 text-info fw-semibold">
                      📋 Incidents for {selectedStudent} in {selectedExam}
                    </h6>
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-2 shadow-sm">
                        <thead className="table-light">
                          <tr>
                            <th>Type</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupedByExam[selectedExam][selectedStudent].map((i) => (
                            <tr key={i._id}>
                              <td>
                                <span className="badge bg-warning text-dark">{i.type}</span>
                              </td>
                              <td>{new Date(i.timestamp).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <p className="mt-3 text-muted">Click a student to view their incidents.</p>
                )}
              </>
            ) : (
              <p className="mt-3 text-muted">Click an exam to view flagged students.</p>
            )}
          </div>
        </div>
      )}
      <button onClick={() => navigate(-1)} className="btn-back gap-3 mt-9">
        ⬅ Back
      </button>
    </div>
  );
}

export default FlaggedIncidents;
