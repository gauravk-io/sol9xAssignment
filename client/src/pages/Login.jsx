import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
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
        className="w-full max-w-md rounded-xl border border-white/5 bg-white/[0.015] p-8 shadow-2xl backdrop-blur-[20px]"
      >
        <div className="mb-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-center text-white">Enter your details to access your dashboard</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="ml-1 text-sm font-medium text-white">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 shrink-0 -translate-y-1/2 text-white" size={18} />
              <input 
                type="email" 
                placeholder="name@example.com" 
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 pl-12 text-white transition-all placeholder:text-white/50 focus:border-zinc-400 focus:bg-zinc-950 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-sm font-medium text-white">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 shrink-0 -translate-y-1/2 text-white" size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 pl-12 text-white transition-all placeholder:text-white/50 focus:border-zinc-400 focus:bg-zinc-950 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 text-lg font-medium text-white transition-all hover:bg-white/10 hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-white">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-white underline-offset-4 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
