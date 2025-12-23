import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, BookOpen, Loader2 } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    course: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div 
        className="w-full max-w-md space-y-6 rounded-xl border border-white/5 bg-white/[0.015] p-8 shadow-2xl backdrop-blur-[20px]"
      >
        <div className="mb-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="mt-2 text-center text-white">Join sol9x Pvt Ltd today</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="ml-1 text-sm font-medium text-white">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 shrink-0 -translate-y-1/2 text-white" size={18} />
              <input 
                name="name"
                type="text" 
                placeholder="John Doe" 
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 pl-12 text-white transition-all placeholder:text-white/50 focus:border-zinc-400 focus:bg-zinc-950 focus:outline-none"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="ml-1 text-sm font-medium text-white">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 shrink-0 -translate-y-1/2 text-white" size={18} />
              <input 
                name="email"
                type="email" 
                placeholder="name@example.com" 
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 pl-12 text-white transition-all placeholder:text-white/50 focus:border-zinc-400 focus:bg-zinc-950 focus:outline-none"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="ml-1 text-sm font-medium text-white">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 shrink-0 -translate-y-1/2 text-white" size={18} />
              <input 
                name="password"
                type="password" 
                placeholder="••••••••" 
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 pl-12 text-white transition-all placeholder:text-white/50 focus:border-zinc-400 focus:bg-zinc-950 focus:outline-none"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="ml-1 text-sm font-medium text-white">Course</label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 shrink-0 -translate-y-1/2 text-white" size={18} />
              <input 
                name="course"
                type="text" 
                placeholder="e.g. MERN Bootcamp" 
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 pl-12 text-white transition-all placeholder:text-white/50 focus:border-zinc-400 focus:bg-zinc-950 focus:outline-none"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 text-lg font-medium text-white transition-all hover:bg-white/10 hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
            disabled={loading}
          >
             {loading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-white">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-white underline-offset-4 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
