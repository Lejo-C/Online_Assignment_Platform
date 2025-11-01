import React, { useEffect, useState } from 'react';
import 'animate.css';

function FlaggedIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch('/api/incidents', {
          credentials: 'include',
        });
        const data = await res.json();
        setIncidents(data);
        console.log('✅ Incidents loaded:', data.length);
      } catch (err) {
        console.error('❌ Error fetching incidents:', err);
      }
    };

    fetchIncidents();
  }, []);

  const groupedByStudent = incidents.reduce((acc, incident) => {
    const name = incident.studentName || incident.studentId?.name || 'Unknown';
    if (!acc[name]) acc[name] = [];
    acc[name].push(incident);
    return acc;
  }, {});

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
      <h2 className="text-danger fw-bold mb-4 animate__animated animate__fadeInDown">🚨 Flagged Incidents</h2>

      {incidents.length === 0 ? (
        <p className="text-muted">No incidents found.</p>
      ) : (
        <div className="row">
          {/* Student list */}
          <div className="col-12 col-md-4 mb-4 mb-md-0 animate__animated animate__fadeInLeft">
            <h5 className="text-primary fw-semibold mb-3">👤 Students</h5>
            <ul className="list-group shadow-sm">
              {Object.keys(groupedByStudent).map((name) => (
                <li
                  key={name}
                  className={`list-group-item list-group-item-action ${selectedStudent === name ? 'active' : ''}`}
                  onClick={() => setSelectedStudent(name)}
                  style={{ cursor: 'pointer' }}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>

          {/* Incident table */}
          <div className="col-12 col-md-8 animate__animated animate__fadeInUp">
            {selectedStudent ? (
              <>
                <h5 className="mt-3 text-success fw-semibold">📋 Incidents for {selectedStudent}</h5>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-2 shadow-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Exam</th>
                        <th>Type</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedByStudent[selectedStudent].map((i) => (
                        <tr key={i._id}>
                          <td>{i.exam?.name || 'Deleted Exam'}</td>
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
          </div>
        </div>
      )}
    </div>
  );
}

export default FlaggedIncidents;
