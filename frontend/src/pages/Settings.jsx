import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { User, Palette, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', currency: user?.currency || 'INR' });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your account and all data.')) return;
    try {
      await api.delete('/auth/me');
      logout();
      navigate('/login');
      toast.success('Account deleted');
    } catch { toast.error('Failed to delete account'); }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-400">Manage your account preferences</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-slate-700">Profile</h3>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
            <input value={user?.email} disabled
              className="w-full border border-slate-100 rounded-xl px-4 py-3 text-sm bg-slate-50 text-slate-400 cursor-not-allowed" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Currency</label>
            <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="INR">🇮🇳 INR — Indian Rupee</option>
              <option value="USD">🇺🇸 USD — US Dollar</option>
              <option value="EUR">🇪🇺 EUR — Euro</option>
              <option value="GBP">🇬🇧 GBP — British Pound</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-slate-500" />
          </div>
          <h3 className="font-semibold text-slate-700">About</h3>
        </div>
        <div className="text-sm text-slate-400 space-y-1">
          <p>Member since: <span className="text-slate-600">{new Date(user?.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' })}</span></p>
          <p>Version: <span className="text-slate-600">1.0.0</span></p>
        </div>
      </div>

      <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
        <div className="flex items-center gap-3 mb-2">
          <Trash2 className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-red-600">Danger Zone</h3>
        </div>
        <p className="text-sm text-red-400 mb-4">Deleting your account is irreversible. All data will be permanently removed.</p>
        <button onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition">
          Delete My Account
        </button>
      </div>
    </div>
  );
}
