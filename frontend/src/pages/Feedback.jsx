import { useEffect, useState } from 'react';
import axios from 'axios';

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({
    student_id: '',
    meal_date: '',
    meal_type_id: '',
    rating: '',
    feed_text: ''
  });

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/feedback');
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/feedback', form);
      setForm({ student_id: '', meal_date: '', meal_type_id: '', rating: '', feed_text: '' });
      fetchFeedbacks();
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Feedback</h2>

      <form onSubmit={submitFeedback} className="space-y-4 bg-white p-4 rounded shadow-md mb-6">
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
          value={form.meal_date}
          onChange={(e) => setForm({ ...form, meal_date: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Meal Type ID"
          value={form.meal_type_id}
          onChange={(e) => setForm({ ...form, meal_type_id: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Rating (1-5)"
          min="1"
          max="5"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Feedback"
          value={form.feed_text}
          onChange={(e) => setForm({ ...form, feed_text: e.target.value })}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Submit Feedback
        </button>
      </form>

      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <p className="text-gray-600">No feedback available.</p>
        ) : (
          feedbacks.map((f, idx) => (
            <div key={idx} className="bg-white shadow rounded p-4">
              <div><strong>Student ID:</strong> {f.STUDENT_ID}</div>
              <div><strong>Date:</strong> {f.MEAL_DATE}</div>
              <div><strong>Meal Type ID:</strong> {f.MEAL_TYPE_ID}</div>
              <div><strong>Rating:</strong> {f.RATING}</div>
              <div><strong>Feedback:</strong> {f.FEED_TEXT}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
