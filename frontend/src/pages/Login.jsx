import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../api/client';
import { useDispatch } from 'react-redux';
import { setToken, setUser, setLoading, setError } from '../store/authSlice';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setErrorMsg] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    dispatch(setLoading(true));

    try {
      const response = await userAPI.login(formData);
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      dispatch(setToken(token));
      dispatch(setUser(response.data.user));
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setErrorMsg(msg);
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-orange-500 hover:text-orange-600 font-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
