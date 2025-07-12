import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/users';
const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
});

const Browse = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const [searchName, setSearchName] = useState('');
    const [searchSkill, setSearchSkill] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [requestForm, setRequestForm] = useState({
        offeredSkill: '',
        targetSkill: '',
        message: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 6;

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, availabilityFilter, searchName, searchSkill]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/skills`, {
                headers: getAuthHeaders(),
            });
            setUsers(res.data.users || []);
        } catch (err) {
            setError('Failed to fetch users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = [...users];

        // Filter by availability
        if (availabilityFilter !== 'all') {
            filtered = filtered.filter((user) =>
                user.availability?.includes(availabilityFilter)
            );
        }

        // Search by name
        if (searchName.trim() !== '') {
            filtered = filtered.filter((user) =>
                user.name.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        // Search by skill (in skills or wantedSkills)
        if (searchSkill.trim() !== '') {
            filtered = filtered.filter((user) =>
                (user.skills || []).some((skill) =>
                    skill.toLowerCase().includes(searchSkill.toLowerCase())
                ) ||
                (user.wantedSkills || []).some((skill) =>
                    skill.toLowerCase().includes(searchSkill.toLowerCase())
                )
            );
        }

        setFilteredUsers(filtered);
    };

    const handleRequestSkill = (user) => {
        setSelectedUser(user);
        setShowRequestModal(true);
    };

    const submitRequest = async () => {
        const { offeredSkill, targetSkill, message } = requestForm;
        if (!offeredSkill || !targetSkill) {
            alert('Please select both skills.');
            return;
        }

        try {
            await axios.post(
                `${API_BASE_URL}/request-skill`,
                {
                    targetEmail: selectedUser.email,
                    offeredSkill,
                    wantedSkill: targetSkill,
                    message,
                },
                {
                    headers: getAuthHeaders(),
                }
            );

            alert('Skill swap request sent!');
            setShowRequestModal(false);
            setRequestForm({ offeredSkill: '', targetSkill: '', message: '' });
        } catch (err) {
            alert('Failed to send request');
            console.error('Request error:', err);
        }
    };

    const getCurrentPageUsers = () => {
        const startIndex = (currentPage - 1) * usersPerPage;
        return filteredUsers.slice(startIndex, startIndex + usersPerPage);
    };

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    if (loading) return <div className="p-6 text-center">Loading...</div>;
    if (error)
        return <div className="p-6 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Browse Skills</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="font-medium block mb-1">Search by Name:</label>
                    <input
                        type="text"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="border rounded p-2 w-full"
                        placeholder="Type a username..."
                    />
                </div>

                <div>
                    <label className="font-medium block mb-1">Search by Skill:</label>
                    <input
                        type="text"
                        value={searchSkill}
                        onChange={(e) => setSearchSkill(e.target.value)}
                        className="border rounded p-2 w-full"
                        placeholder="Type a skill..."
                    />
                </div>

                <div>
                    <label className="font-medium block mb-1">Filter by Availability:</label>
                    <select
                        className="border rounded p-2 w-full"
                        value={availabilityFilter}
                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                            (day) => (
                                <option key={day} value={day}>
                                    {day}
                                </option>
                            )
                        )}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentPageUsers().map((user, idx) => (
                    <div key={idx} className="border rounded-lg p-4 shadow bg-white">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center text-xl font-semibold">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h4 className="font-bold">{user.name}</h4>
                                <p className="text-sm text-gray-600">{user.location}</p>
                                <p className="text-sm text-yellow-600">
                                    Rating: {user.rating || 'Not rated'}
                                </p>
                            </div>
                        </div>

                        <div className="mb-2">
                            <strong>Skills Offered:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {user.skills?.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-2">
                            <strong>Skills Wanted:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {user.wantedSkills?.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-2">
                            <strong>Availability:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {user.availability?.map((day, i) => (
                                    <span
                                        key={i}
                                        className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded"
                                    >
                                        {day}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => handleRequestSkill(user)}
                            className="mt-2 w-full bg-indigo-600 text-white py-1 rounded hover:bg-indigo-700"
                        >
                            Request Skill Swap
                        </button>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-6 flex justify-center space-x-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {showRequestModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow">
                        <h3 className="text-lg font-semibold mb-2">Request Skill Swap</h3>
                        <p className="text-sm mb-4">To: {selectedUser?.name}</p>

                        <label className="block text-sm font-medium mb-1">Your Skill to Offer:</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2 mb-3"
                            value={requestForm.offeredSkill}
                            onChange={(e) =>
                                setRequestForm({ ...requestForm, offeredSkill: e.target.value })
                            }
                        />

                        <label className="block text-sm font-medium mb-1">Skill You Want:</label>
                        <select
                            className="w-full border rounded p-2 mb-3"
                            value={requestForm.targetSkill}
                            onChange={(e) =>
                                setRequestForm({ ...requestForm, targetSkill: e.target.value })
                            }
                        >
                            <option value="">Select a skill</option>
                            {selectedUser?.skills?.map((skill, idx) => (
                                <option key={idx} value={skill}>
                                    {skill}
                                </option>
                            ))}
                        </select>

                        <label className="block text-sm font-medium mb-1">Message (optional):</label>
                        <textarea
                            className="w-full border rounded p-2 mb-3"
                            rows="4"
                            value={requestForm.message}
                            onChange={(e) =>
                                setRequestForm({ ...requestForm, message: e.target.value })
                            }
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowRequestModal(false)}
                                className="px-4 py-1 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitRequest}
                                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Browse;
