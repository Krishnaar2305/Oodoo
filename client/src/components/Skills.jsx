import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:4000/api/users';
const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
});

const Skills = () => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        skillsOffered: '',
        skillsWanted: '',
        availability: [],
        visibility: 'private'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const availabilityOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/me`, {
                headers: getAuthHeaders()
            });
            const user = res.data;
            setFormData({
                name: user.name || '',
                location: user.location || '',
                skillsOffered: (user.skills || []).join(', '),
                skillsWanted: (user.wantedSkills || []).join(', '),
                availability: user.availability || [],
                visibility: user.public ? 'public' : 'private'
            });
        } catch (err) {
            console.error('Failed to fetch user data', err);
            setError('Unable to load profile. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvailabilityChange = (day) => {
        setFormData(prev => ({
            ...prev,
            availability: prev.availability.includes(day)
                ? prev.availability.filter(d => d !== day)
                : [...prev.availability, day]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const dataToSubmit = {
                ...formData,
                skillsOffered: formData.skillsOffered.split(',').map(s => s.trim()).filter(Boolean),
                skillsWanted: formData.skillsWanted.split(',').map(s => s.trim()).filter(Boolean)
            };

            await axios.post(`${API_BASE_URL}/save-skills`, dataToSubmit, {
                headers: getAuthHeaders()
            });

            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update skills.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* <Navbar /> */}
            <div className="max-w-2xl mx-auto p-6 mt-6 bg-white shadow rounded">
                <h2 className="text-2xl font-semibold mb-4">Update Your Skills</h2>

                {error && <p className="text-red-600 mb-3">{error}</p>}
                {success && <p className="text-green-600 mb-3">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2"
                            placeholder="e.g., Delhi, India"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Skills Offered (comma separated)</label>
                        <input
                            type="text"
                            name="skillsOffered"
                            value={formData.skillsOffered}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2"
                            placeholder="e.g., React, JavaScript"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Skills Wanted (comma separated)</label>
                        <input
                            type="text"
                            name="skillsWanted"
                            value={formData.skillsWanted}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2"
                            placeholder="e.g., Python, UI/UX"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Availability</label>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {availabilityOptions.map(day => (
                                <label key={day} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.availability.includes(day)}
                                        onChange={() => handleAvailabilityChange(day)}
                                    />
                                    <span>{day}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium">Profile Visibility</label>
                        <select
                            name="visibility"
                            value={formData.visibility}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2"
                        >
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {loading ? 'Saving...' : 'Save Skills'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default Skills;
