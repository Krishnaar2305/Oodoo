import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/users/signup', { email, password });
      localStorage.setItem('accessToken', res.data.accessToken);
      navigate('/profile');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Sign Up</h2>

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{errorMsg}</div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          className="border p-2 w-full"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="border p-2 w-full"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">
          Sign Up
        </button>
      </form>

      <button
        onClick={() => navigate('/login')}
        className="mt-4 text-green-600 font-medium"
      >
        Already have an account? Log in →
      </button>
    </div>
  );
}
