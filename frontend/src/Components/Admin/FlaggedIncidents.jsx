import React, { useEffect, useState } from 'react';

export default function FlaggedIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/incidents', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch incidents');
        const data = await res.json();
        setIncidents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('❌ Error fetching incidents:', err);
        setErrorMsg('Unable to load flagged incidents.');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  // Group incidents by student name
  const grouped = incidents.reduce((acc, incident) => {
    const name = incident.studentName;
    if (!acc[name]) acc[name] = [];
    acc[name].push(incident);
    return acc;
  }, {});

  return (
    <div className="container mt-5">
      <h2 className="h4 fw-bold mb-4 text-danger text-center">🚨 Flagged Incidents</h2>

      {loading ? (
        <p className="text-center text-muted">Loading incidents...</p>
      ) : errorMsg ? (
        <p className="text-center text-danger">{errorMsg}</p>
      ) : incidents.length === 0 ? (
        <p className="text-center text-muted">No violations have been reported.</p>
      ) : (
        <>
          <div className="d-flex flex-wrap gap-3 justify-content-center mb-4">
            {Object.keys(grouped).map((studentName) => (
              <div
                key={studentName}
                className={`border rounded p-3 text-center shadow-sm ${
                  selectedStudent === studentName ? 'bg-danger text-white' : 'bg-light'
                }`}
                style={{ width: '150px', cursor: 'pointer' }}
                onClick={() =>
                  setSelectedStudent((prev) => (prev === studentName ? '' : studentName))
                }
              >
                <strong>{studentName}</strong>
              </div>
            ))}
          </div>

          {selectedStudent && (
            <div className="table-responsive">
              <h5 className="text-center text-primary mb-3">
                Incidents for <strong>{selectedStudent}</strong>
              </h5>
              <table className="table table-bordered table-hover bg-white">
                <thead className="table-danger">
                  <tr>
                    <th>Violation Type</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[selectedStudent].map((incident) => (
                    <tr key={incident._id}>
                      <td>{incident.type}</td>
                      <td>{new Date(incident.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
