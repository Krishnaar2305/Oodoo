import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/users/login', { email, password });
      localStorage.setItem('accessToken', res.data.accessToken);
      navigate('/profile');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Log In</h2>

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{errorMsg}</div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
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
        <button type="submit" className="bg-green-600 text-white p-2 w-full rounded">
          Log In
        </button>
      </form>

      <button
        onClick={() => navigate('/signup')}
        className="mt-4 text-blue-600 font-medium"
      >
        New user? Create an account →
      </button>
    </div>
  );
}
