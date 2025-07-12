import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:4000/api/users';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`
});

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/me`, {
        headers: getAuthHeaders()
      });
      const { pendingSkillSwaps, pendingSkillSwaps_messages } = res.data;

      const formatted = pendingSkillSwaps.map((swap, index) => ({
        id: index + 1,
        email: swap.userEmail,
        name: swap.userEmail.split('@')[0],
        skillOffered: swap.offeredSkill,
        skillWanted: swap.wantedSkill,
        message: pendingSkillSwaps_messages?.[swap.userEmail] || '',
        status: 'pending'
      }));

      setRequests(formatted);
    } catch (err) {
      console.error(err);
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (email, offeredSkill, wantedSkill, action) => {
    try {
      await axios.post(`${API_BASE_URL}/skill-swap-action`, {
        requesterEmail: email,
        offeredSkill,
        wantedSkill,
        action
      }, {
        headers: getAuthHeaders()
      });

      setRequests(prev =>
        prev.map(req =>
          req.email === email &&
          req.skillOffered === offeredSkill &&
          req.skillWanted === wantedSkill
            ? { ...req, status: action + 'ed' }
            : req
        )
      );

      alert(`Request ${action}ed successfully!`);
    } catch (error) {
      alert(`Failed to ${action} request`);
      console.error(`Error ${action}ing request:`, error);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <>
      {/* <Navbar /> */}
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Skill Swap Requests</h2>
        {requests.length === 0 ? (
          <p>No requests yet.</p>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-gray-100 p-4 rounded-lg shadow mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold">{req.name}</h4>
                  <p className="text-sm text-gray-600">{req.email}</p>
                  <p
                    className={`text-sm font-semibold ${
                      req.status === 'pending'
                        ? 'text-blue-600'
                        : req.status === 'accepted'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    Status: {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <p><strong>Offering:</strong> {req.skillOffered}</p>
                <p><strong>Wants:</strong> {req.skillWanted}</p>
                {req.message && <p><strong>Message:</strong> {req.message}</p>}
              </div>

              {req.status === 'pending' && (
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() =>
                      handleAction(req.email, req.skillOffered, req.skillWanted, 'accept')
                    }
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleAction(req.email, req.skillOffered, req.skillWanted, 'reject')
                    }
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Requests;
