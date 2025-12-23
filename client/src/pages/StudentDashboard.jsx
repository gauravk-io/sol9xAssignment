import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  User, Mail, BookOpen, Calendar,
  Edit3, Save, Loader2, ChevronRight, CheckCircle2
} from 'lucide-react';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', course: '', oldPassword: '', password: '' });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/profile');
      setProfile(data);
      setFormData({
        name: data.name,
        email: data.email,
        course: data.course,
        oldPassword: '',
        password: ''
      });
    } catch (error) {
      showNotice('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotice = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        course: formData.course
      };

      if (formData.password.trim()) {
        if (!formData.oldPassword.trim()) {
          return showNotice('Current password is required to set a new one', 'error');
        }
        payload.password = formData.password;
        payload.oldPassword = formData.oldPassword;
      }

      const { data } = await api.put('/profile', payload);
      setProfile(data);
      setFormData({ ...formData, oldPassword: '', password: '' });
      setIsEditing(false);
      showNotice('Profile updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      showNotice(error.response?.data?.message || 'Update failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader2 className="mb-4 animate-spin text-white" size={40} />
        <p className="text-white">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-4">
        <div
          className="h-[calc(100vh-160px)] md:col-span-1"
        >
          <div className="flex h-full flex-col items-center overflow-y-auto rounded-xl border border-white/5 bg-white/[0.015] p-8 text-center backdrop-blur-[20px]">
            <div className="group relative">
              <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-zinc-800 text-4xl font-black text-white shadow-xl">
                {profile?.name.charAt(0)}
              </div>
            </div>
            <h2 className="text-2xl font-black tracking-tighter text-white">{profile?.name}</h2>
            <p className="mt-2 mb-8 text-xs font-bold uppercase tracking-[0.2em] text-white">ID: {profile?._id.slice(-6).toUpperCase()}</p>

            <div className="w-full space-y-6 border-t border-zinc-800/50 pt-8 pb-10 text-left">
              <div className="group flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900/50 text-white transition-colors group-hover:text-white">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white">Enrolled Since</p>
                  <p className="mt-0.5 text-sm font-bold text-white">{new Date(profile?.enrollmentDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!isEditing) {
                  setFormData({
                    name: profile.name,
                    email: profile.email,
                    course: profile.course,
                    oldPassword: '',
                    password: ''
                  });
                }
                setIsEditing(!isEditing);
              }}
              className={`mt-10 flex h-14 w-full items-center justify-center gap-2 rounded-lg border font-bold transition-all ${isEditing ? 'border-white/20 bg-transparent text-white hover:bg-white/5' : 'border-white/20 bg-white/5 text-white shadow-lg hover:bg-white/10 hover:border-white/40 active:scale-95'}`}
            >
              {isEditing ? 'Discard Changes' : <><Edit3 size={18} /> Update Profile</>}
            </button>
          </div>
        </div>

        {/* Profile Details / Edit Form */}
        <div
          className="h-[calc(100vh-160px)] md:col-span-3"
        >
          <div className="h-full overflow-y-auto rounded-xl border border-white/5 bg-white/[0.015] p-10 backdrop-blur-[20px]">
            <div className="mb-12">
              <h1 className="text-4xl font-black tracking-tighter text-white">
                {isEditing ? 'Modify Details' : 'Profile Overview'}
              </h1>
              <p className="mt-2 font-medium text-white">Manage your academic profile and update your account credentials</p>
            </div>

            {!isEditing ? (
              <div className="space-y-12">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                      <User size={12} className="shrink-0" /> Full Name
                    </p>
                    <p className="text-xl font-bold text-white">{profile?.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                      <Mail size={12} className="shrink-0" /> Email
                    </p>
                    <p className="text-xl font-bold text-white">{profile?.email}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                      <BookOpen size={12} className="shrink-0" /> Course Program
                    </p>
                    <span className="inline-flex rounded-xl border border-zinc-700/50 bg-zinc-800 px-4 py-2 text-lg font-bold text-white shadow-inner">
                      {profile?.course}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="max-w-2xl space-y-10">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-12 w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2 text-white focus:border-zinc-400 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12 w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2 text-white focus:border-zinc-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white">Current Course</label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    required
                    className="h-12 w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2 text-white focus:border-zinc-400 focus:outline-none"
                  />
                </div>

                <div className="border-t border-zinc-800/50 pt-10">
                  <p className="mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-white">Update Password</p>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-3">
                      <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white">Current Password</label>
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={formData.oldPassword}
                        onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                        required={formData.password.trim() !== ''}
                        className="h-12 w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2 text-white transition-all placeholder:text-white/50 focus:border-zinc-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white">New Password</label>
                      <input
                        type="password"
                        placeholder="New Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="h-12 w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2 text-white transition-all placeholder:text-white/50 focus:border-zinc-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="flex h-14 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-12 text-lg font-bold text-white shadow-xl transition-all hover:bg-white/20 hover:border-white/40">
                    <Save size={20} /> Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 rounded-xl border border-zinc-800 px-6 py-4 shadow-2xl ${
            notification.type === 'error' ? 'bg-zinc-900 text-zinc-50' : 'bg-zinc-50 text-zinc-950'
          }`}
        >
          <CheckCircle2 size={20} />
          <p className="font-medium">{notification.msg}</p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
