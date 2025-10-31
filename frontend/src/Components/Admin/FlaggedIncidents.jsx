import React, { useEffect, useState } from 'react';

function FlaggedIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/incidents', {
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

  // Group incidents by student name
  const groupedByStudent = incidents.reduce((acc, incident) => {
    const name = incident.studentName || incident.studentId?.name || 'Unknown';
    if (!acc[name]) acc[name] = [];
    acc[name].push(incident);
    return acc;
  }, {});

  return (
    <div className="container mt-4">
      <h2>🚨 Flagged Incidents</h2>

      {incidents.length === 0 ? (
        <p>No incidents found.</p>
      ) : (
        <div className="row">
          {/* Student list */}
          <div className="col-md-4">
            <h5>👤 Students</h5>
            <ul className="list-group">
              {Object.keys(groupedByStudent).map((name) => (
                <li
                  key={name}
                  className={`list-group-item ${selectedStudent === name ? 'active' : ''}`}
                  onClick={() => setSelectedStudent(name)}
                  style={{ cursor: 'pointer' }}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>

          {/* Incident table */}
          <div className="col-md-8">
            {selectedStudent ? (
              <>
                <h5 className="mt-3">📋 Incidents for {selectedStudent}</h5>
                <table className="table table-striped table-bordered mt-2">
                  <thead>
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
                        <td>{i.type}</td>
                        <td>{new Date(i.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p className="mt-3">Click a student to view their incidents.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FlaggedIncidents;
