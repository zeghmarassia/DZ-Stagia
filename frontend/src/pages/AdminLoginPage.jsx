import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../store'; // Importing from your store.js
// import axiosInstance from '../config/axios'; // Using your configured axios instance
import { loginAdmin } from '../services/AdminService';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    // Call the centralized service function
    const response = await loginAdmin({ email, password });
    console.log('Login response:', response.data);

    // Store token and user type in localStorage
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('userType', response.data.user_type);
    // Destructure the data returned by your backend
    const { access_token, user } = response.data;
    // Update Redux and LocalStorage using your store's action
    dispatch(setCredentials({
      user: user,
      token: access_token,
      userType: 'admin' // Ensures Navbar renders Admin links
    }));


    // Redirect to the admin dashboard
    navigate('/admin/dashboard');
  } catch (err) {
    // Handle errors using the response from axiosInstance
    setError(err.response?.data?.message || "Identifiants administrateur invalides.");
    console.error('Admin Login Error:', err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-teal-50 rounded-2xl mb-4">
            <span className="text-2xl font-black text-teal-600 cursor-pointer" onClick={()=> navigate('/')}>STAGIA</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Portail Administrateur</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Connectez-vous pour gérer la plateforme</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Email Professionnel
            </label>
            <input
              type="email"
              required
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder:text-slate-300"
              placeholder="admin@stagia.dz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Mot de passe
            </label>
            <input
              type="password"
              required
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder:text-slate-300"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg hover:bg-slate-800 active:scale-[0.98] ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Authentification...' : 'Se Connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
