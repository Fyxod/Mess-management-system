import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LeaveRequests() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    student_id: '',
    start_date: '',
    end_date: '',
    reason: ''
  });

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/leave');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
    }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/leave', form);
      setForm({ student_id: '', start_date: '', end_date: '', reason: '' });
      fetchRequests();
    } catch (err) {
      console.error('Error submitting leave request:', err);
    }
  };

  const approveRequest = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/leave/${id}/approve`);
      fetchRequests();
    } catch (err) {
      console.error('Error approving leave request:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Leave Requests</h2>

      <form onSubmit={submitRequest} className="space-y-4 bg-white p-4 rounded shadow mb-6">
        <input
          type="number"
          placeholder="Student ID"
          value={form.student_id}
          onChange={(e) => setForm({ ...form, student_id: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Submit Leave Request
        </button>
      </form>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <p className="text-gray-600">No leave requests found.</p>
        ) : (
          requests.map((req) => (
            <div key={req.LEAVE_ID} className="bg-white shadow rounded p-4">
              <div><strong>Student ID:</strong> {req.STUDENT_ID}</div>
              <div><strong>From:</strong> {req.FROM_DATE}</div>
              <div><strong>To:</strong> {req.TO_DATE}</div>
              <div><strong>Reason:</strong> {req.REASON}</div>
              <div><strong>Status:</strong> {req.STATUS}</div>
              {(req.STATUS === 'Pending' || req.STATUS === 'PENDING') && (
                <button
                  onClick={() => approveRequest(req.LEAVE_ID)}
                  className="mt-2 px-4 py-1 bg-green-600 text-white rounded"
                >
                  Approve
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}