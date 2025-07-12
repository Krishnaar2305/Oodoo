import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:4000/api/users';

const SKILL_OPTIONS = [
  { value: 'Graphic Design', label: 'Graphic Design' },
  { value: 'Video Editing', label: 'Video Editing' },
  { value: 'Photoshop', label: 'Photoshop' },
  { value: 'Python', label: 'Python' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'Manager', label: 'Manager' }
];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setPhoto(Object.assign(file, { preview: URL.createObjectURL(file) }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false
  });

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setUser(res.data);
    } catch (err) {
      console.error(err);
      navigate('/login');
    }
  };

  const handleRemovePhoto = () => setPhoto(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (!user) return <div className="text-center mt-8">Loading profile...</div>;

  return (
    <>
      {/* <Navbar /> */}
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Info */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={user.name || ''}
                readOnly
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={user.email}
                readOnly
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Location</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={user.location || ''}
                readOnly
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Skills Offered</label>
              <Select
                isMulti
                isDisabled
                options={SKILL_OPTIONS}
                value={(user.skills || []).map(skill => ({ value: skill, label: skill }))}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Skills Wanted</label>
              <Select
                isMulti
                isDisabled
                options={SKILL_OPTIONS}
                value={(user.wantedSkills || []).map(skill => ({ value: skill, label: skill }))}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Availability</label>
              <div className="flex flex-wrap gap-2">
                {(user.availability || []).map((day, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {day}
                  </span>
                ))}
                {user.availability?.length === 0 && <span>Not specified</span>}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Profile Visibility</label>
              <p className="text-sm font-semibold text-gray-700">
                {user.public ? 'Public' : 'Private'}
              </p>
            </div>
          </div>

          {/* Right column - Profile Photo */}
          <div className="flex flex-col items-center">
            <div
              {...getRootProps()}
              className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
            >
              <input {...getInputProps()} />
              {photo ? (
                <img src={photo.preview} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <p className="text-center text-gray-500 text-sm">
                  {isDragActive ? 'Drop image...' : 'Drag & drop photo'}
                </p>
              )}
            </div>
            {photo && (
              <button
                onClick={handleRemovePhoto}
                className="mt-2 text-red-500 text-sm"
              >
                Remove Photo
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
